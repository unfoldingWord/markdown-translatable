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
// turndownService.addRule('bold-italic', {
//   filter: function (node: HTMLElement) {
//     return node.innerHTML.match(/<strong><em>.*<\/em><\/strong>/);
//   },
//   replacement: (_, node) => {
//     const content = node.innerHTML.match(/<strong><em>(.*)<\/em><\/strong>/)[1];
//     return `**_${content}_**`;
//   },
// });
turndownService.addRule('emphasis', {
  filter: ['em'],
  replacement: (content) => `*${content}*`,
});

const markdownToHtmlConverter = new showdown.Converter();
export const toDisplay = (content) =>
  content.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const fromDisplay = (content) =>
  content.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

export const htmlToMarkdown = ({ html, outputFilters = [] }) => {

  debugger;

  let markdown = turndownService.turndown(html);
  markdown = filter({ string: markdown, filters: outputFilters });

  if (markdown === '&#8203;') {
    markdown = '';
  }

  return markdown;
};


export const markdownToHtml = ({ markdown, inputFilters = [] }) => {

  debugger;

  let _markdown = markdown.slice(0);
  _markdown = filter({ string: _markdown, filters: inputFilters });
  let html = markdownToHtmlConverter.makeHtml(_markdown);

  if (!html || html === '') {
    html = '<p>&#8203;</p>';
  }

  return html;
};
