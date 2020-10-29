export const blocksFromMarkdown = ({ markdown }) => {
  const blocks = markdown.replace(/<br>/gi, '\n').split(/\n\n/g);

  const _blocks = [];

  blocks.forEach((block) => {
    // Delete a block by emptying it.
    if (block.length > 0) {
      _blocks.push(block);
    }
  });

  if (_blocks.length == 0) {
    _blocks.push('');
  }

  return _blocks;
};

export const markdownFromBlocks = ({ blocks }) => blocks.join(`\n\n`);

export const sectionsFromMarkdown = ({ markdown }) => {
  let sections: any = [];
  let section: string[] = [];
  const blocks = markdown.replace(/<br>/gi, '\n').split(/\n\n/g);

  blocks.forEach((block) => {
    const headingRegex = /^\s?#+/;
    const heading = headingRegex.test(block);

    if (section.length > 0 && heading) {
      sections.push(section);
      section = [];
    }

    // Delete a block by emptying it.
    if (block.length > 0) {
      section.push(block);
    }
  });

  // don't leave a dangling section (orphaned)
  if (section !== []) {
    sections.push(section);
    section = [];
  }

  // Don't allow empty section,
  // (since originalBlocks will be compared to translationBlock).
  if (sections.length == 0) {
    sections.push('');
  }

  sections = sections.map((blocks) => blocks.join(`\n\n`));

  return sections;
};

export const markdownFromSections = ({ sections }) => sections.join(`\n\n`);
