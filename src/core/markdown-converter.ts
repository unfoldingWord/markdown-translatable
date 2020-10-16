import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import showdown from 'showdown';
import { filter } from './string';

const turndownService = new TurndownService({ headingStyle: 'atx' });
turndownService.use(gfm);
turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: (content) => `~${content}~`,
});
turndownService.addRule('underline', {
  filter: ['u'],
  replacement: (content) => `<u>${content}</u>`,
});
// bold-italic <strong><em>...</em></strong>
// See below: emphasis rule allows bold-italic to pass through as _content_.
turndownService.addRule('bold-italic', {
  filter: (node, options) => node.nodeName === 'STRONG' && node.childNodes && node.childNodes.length == 1 && node.childNodes[0].nodeName === 'EM',
  replacement: (content) => `**${content}**`,
});
// <em> node NOT under a <strong> node.
// Will allow the embedded <em>content</em> to pass through as _content_
turndownService.addRule('emphasis', {
  //filter: ['em'],filter: (node, options) => {
  filter: (node, options) => node.nodeName === 'EM' && node.parentNode && node.parentNode.nodeName != 'STRONG',
  replacement: (content) => `*${content}*`,
});

const markdownToHtmlConverter = new showdown.Converter({ noHeaderId: true });
export const toDisplay = (content) => content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const fromDisplay = (content) => content.replace(/<div><br\\?><\/div>/, '\n').replace(/<br\\?>/, '\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

export const htmlToMarkdown = ({ html, filters = [] }) => {
  let string = turndownService.turndown((html || ''));
  string = filter({ string, filters });
  // string = string.replace(/\n/ig, '<br/>');

  if (string === '&#8203;') {
    string = '';
  }
  return string;
};

export const markdownToHtml = ({ markdown, filters = [] }) => {
  let _markdown = (markdown || '').slice(0);
  _markdown = filter({ string: _markdown, filters });
  let html = markdownToHtmlConverter.makeHtml(_markdown);
  html = html.replace(/<br\s.\\?>/ig, '<br/>');

  if (!html || html === '') {
    html = '<p>&#8203;</p>';
  }
  return html;
};
