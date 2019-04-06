
export const blocksFromMarkdown = ({markdown}) =>
  markdown.replace(/<br>/gi,'\n').split(/\n\n/g);

export const markdownFromBlocks = ({blocks}) =>
  blocks.join(`\n\n`);
