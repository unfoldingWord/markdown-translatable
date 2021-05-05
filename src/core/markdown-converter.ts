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

const markdownToHtmlConverter = new showdown.Converter({openLinksInNewWindow: true});

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

  // Fix up resource links:
  markdown = markdown.replace(/\\\[\\\[rc:/g, '[[rc:');
  markdown = markdown.replace(/\\\]\\\]/g, ']]');
  markdown = markdown.replace(/\[\]\(rc:\/\/([^)]*)\)/g, '[[rc://$1]]');
  // Asterisk inside of RC link:
  markdown = markdown.replace(/(\[\[.*)(\\\*)(.*\]\])/g, '$1*$3');

  markdown = filter({ string: markdown, filters: outputFilters });

  // Strip NBSP from beginning or end.
  // See below (markdownToHtml) where this NBSP is added to empty blocks.
  while (markdown.match(/^\u200B/))
  {
    markdown = markdown.replace(/\u200B/, '');
  }
  while (markdown.match(/\u200B$/))
  {
    markdown = markdown.replace(/\u200B$/, '');
  }

  // Replace double space.
  markdown = markdown.replace(/(\d+)\. {2,}/g, '$1. ');

  return markdown;
};

export const markdownToHtml = ({ markdown, inputFilters = [] }) => {
  let _markdown = (markdown || '').slice(0);

  // Make "easy" blockquote:
  _markdown = _markdown.replace(/\n\>/g, '  \n\>');
  _markdown = _markdown.replace(/\<br\>\>/g, '  \<br\>\>');

  // Prevent "    *" from being considered as <pre><code>....
  _markdown = _markdown.replace('    *', '*');

  _markdown = filter({ string: _markdown, filters: inputFilters });

  let html = markdownToHtmlConverter.makeHtml(_markdown);
  html = html.replace(/<br\s.\\?>/ig, '<br/>');

  // Insert NBSP into empty blocks.
  // See above (htmlToMarkdown) where this NBSP is later stripped out.
  if (!html || html === '') {
    html = '<p>&#8203;</p>';
  }
  return html;
};
