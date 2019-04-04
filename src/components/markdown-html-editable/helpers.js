import showdown from 'showdown';
import TurndownService from 'turndown';

const turndownService = new TurndownService({headingStyle: 'atx'});
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
