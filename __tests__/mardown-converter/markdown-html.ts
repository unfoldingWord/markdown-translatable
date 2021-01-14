import fs from 'fs';
import path from 'path';
import * as helpers from '../../src/core';

function generateTest(fileName: string) {
  const markdown = fs.readFileSync(path.join(__dirname, './fixtures', `${fileName}.md`), { encoding: 'utf-8' });
  let html = fs.readFileSync(path.join(__dirname, './fixtures', `${fileName}.html`), { encoding: 'utf-8' });
  const markdownToDisplay = helpers.toDisplay(markdown);
  const markdownFromDisplay = helpers.fromDisplay(markdownToDisplay);
  let renderedHtml = helpers.markdownToHtml({ markdown: markdownFromDisplay });

  // Ignore differences in linebreak formats:
  html = html.replace(/\r\n/g, '\n');
  renderedHtml = renderedHtml.replace(/\r\n/g, '\n');

  expect(renderedHtml).toBe(html);
}

describe('Markdown to HTML Converter', () => {
  it(`convert image markdown to html`, () => {
    generateTest('double_underscores');
  });
  it(`convert italic markdown to html`, () => {
    generateTest('italic');
  });
  it(`convert bold italic markdown to html`, () => {
    generateTest('bold_italic');
  });
  it(`convert occurrence note markdown to html`, () => {
    generateTest('occurrence-note');
  });
  it(`convert occurrence note markdown to html`, () => {
    generateTest('occurrence-note-1');
  });

  it(`convert RC link markdown to html`, () => {
    generateTest('rc-link');
  });
  
  it(`convert hyperlink markdown to html`, () => {
    generateTest('hyperlink');
  });
});