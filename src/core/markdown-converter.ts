import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { filter } from './string';
import showdown from 'showdown';

const turndownService = new TurndownService({ headingStyle: 'atx' });
turndownService.use(gfm);
turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: (content) => `~${content}~`,
});
turndownService.addRule('underline', {
  filter: ['u'],
  replacement: (content) => `__${content}__`,
});
turndownService.addRule('emphasis', {
  filter: ['em'],
  replacement: (content) => `*${content}*`,
});
const markdownToHtmlConverter = new showdown.Converter();
markdownToHtmlConverter.setOption('underline', true);

export const htmlToMarkdown = ({ html, outputFilters = [] }) => {
  let markdown = turndownService.turndown(html);
  markdown = filter({ string: markdown, filters: outputFilters });
  if (markdown === '&#8203;') markdown = '';
  return markdown;
};

export const markdownToHtml = ({ markdown, inputFilters = [] }) => {
  let _markdown = markdown.slice(0);
  _markdown = filter({ string: _markdown, filters: inputFilters });
  let html = markdownToHtmlConverter.makeHtml(_markdown);
  if (!html || html === '') html = '<p>&#8203;</p>';
  return html;
};