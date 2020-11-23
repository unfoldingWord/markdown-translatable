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
  filter: (node, options) => {
    return node.nodeName === 'STRONG' && node.childNodes && node.childNodes.length == 1 && node.childNodes[0].nodeName === 'EM';
  },
  replacement: (content) => {
    return `**${content}**`;
  },
});
// <em> node NOT under a <strong> node.
// Will allow the embedded <em>content</em> to pass through as _content_
turndownService.addRule('emphasis', {
  //filter: ['em'],filter: (node, options) => {
  filter: (node, options) => {
    return node.nodeName === 'EM' && node.parentNode && node.parentNode.nodeName != 'STRONG';
  },
  replacement: (content) => `*${content}*`,
});

const markdownToHtmlConverter = new showdown.Converter();
export const toDisplay = (content) => content.replace(/&/g, '&amp;')
  .replace(/<br\\?>/g, '\n')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

export const fromDisplay = (content) => content.replace(/&nbsp;/, ' ')
  .replace(/<br><div>/g, '<div>')
  .replace(/<div>([\s\S]*)<\/div>/g, '\n$1')
  .replace(/<br\\?>/g, '\n')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

export const htmlToMarkdown = ({ html, outputFilters = [] }) => {
  let markdown = turndownService.turndown(html);
  markdown = filter({ string: markdown, filters: outputFilters });

  if (markdown === '&#8203;') {
    markdown = '';
  }
  return markdown;
};

export const markdownToHtml = ({ markdown, inputFilters = [] }) => {
  let _markdown = (markdown || '').slice(0);

  // Make "easy" blockquote:
  _markdown = _markdown.replace(/\n\>/g, '  \n\>');
  _markdown = _markdown.replace(/\<br\>\>/g, '  \<br\>\>');

  _markdown = filter({ string: _markdown, filters: inputFilters });

  let html = markdownToHtmlConverter.makeHtml(_markdown);
  html = html.replace(/<br\s.\\?>/ig, '<br/>');

  if (!html || html === '') {
    html = '<p>&#8203;</p>';
  }
  return html;
};
