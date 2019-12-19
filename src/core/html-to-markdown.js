import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { filter } from './';

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

export const htmlToMarkdown = ({ html, outputFilters = [] }) => {
  let markdown = turndownService.turndown(html);
  markdown = filter({ string: markdown, filters: outputFilters });
  if (markdown === '&#8203;') markdown = '';
  return markdown;
};