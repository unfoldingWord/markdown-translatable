import showdown from 'showdown';
import { filter } from './';

const markdownToHtmlConverter = new showdown.Converter();
markdownToHtmlConverter.setOption('underline', true);

export const markdownToHtml = ({ markdown, inputFilters = [] }) => {
  let _markdown = markdown.slice(0);
  _markdown = filter({ string: _markdown, filters: inputFilters });
  let html = markdownToHtmlConverter.makeHtml(_markdown);
  if (!html || html === '') html = '<p>&#8203;</p>';
  return html;
};