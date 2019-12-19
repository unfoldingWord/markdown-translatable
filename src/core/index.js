export * from './markdown-to-html';
export * from './html-to-markdown';

export const filter = ({ string, filters }) => {
  let _string = string.slice(0);
  filters.forEach((filter) => {
    const [replacee, replacer] = filter;
    _string = _string.replace(replacee, replacer);
  });
  return _string;
};