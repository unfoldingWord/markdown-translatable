import showdown from 'showdown';
import TurndownService from 'turndown';
import {gfm} from 'turndown-plugin-gfm';

export const isHebrew = (string) => {
  const hebrewChars = string.match(/[\u0590-\u05FF]/g) || [];
  const percent = hebrewChars.length / string.length;
  return percent > 0.75;
};

const turndownService = new TurndownService({headingStyle: 'atx'});
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

export const markdownToHtml = ({markdown, inputFilters=[]}) => {
  let _markdown = markdown.slice(0);
  _markdown = filter({string: _markdown, filters: inputFilters});
  const html = markdownToHtmlConverter.makeHtml(_markdown);
  return html;
};

export const htmlToMarkdown = ({html, outputFilters=[]}) => {
  let markdown = turndownService.turndown(html);
  markdown = filter({string: markdown, filters: outputFilters});
  return markdown;
};

export const filter = ({string, filters}) => {
  let _string = string.slice(0);
  filters.forEach((filter) => {
    const [replacee, replacer] = filter;
    _string = _string.replace(replacee, replacer);
  });
  return _string;
};
