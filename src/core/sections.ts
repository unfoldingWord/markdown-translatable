
export const sectionsFromMarkdown = ({markdown}) => {
  let sections = [];
  let section = [];
  const blocks = markdown.replace(/<br>/gi,'\n').split(/\n\n/g);
  blocks.forEach(block => {
    const headingRegex = /^\s?#+/;
    const heading = headingRegex.test(block);
    if ((section.length > 0) && heading) {
      sections.push(section);
      section = [];
    }
    section.push(block);
  });
  // don't leave a dangling section
  if (section !== []) {
    sections.push(section);
    section = [];
  }
  sections = sections.map(blocks => blocks.join(`\n\n`));
  return sections;
};

export const markdownFromSections = ({sections}) =>
  sections.join(`\n\n`);
