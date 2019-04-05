
export const blocksFromMarkdown = ({markdown}) =>
  markdown.replace(/<br>/gi,'\n').split(/\n\n/g);
