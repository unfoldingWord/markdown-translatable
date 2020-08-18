import fs from 'fs';
import path from 'path';
import * as helpers from '../../src/core';

function generateTest(fileName: string) {
  const markdown = fs.readFileSync(path.join(__dirname, './fixtures', `${fileName}.md`), { encoding: 'utf-8' });
  const html = fs.readFileSync(path.join(__dirname, './fixtures', `${fileName}.html`), { encoding: 'utf-8' });
  const markdownToDisplay = helpers.toDisplay(markdown);
  const markdownFromDisplay = helpers.fromDisplay(markdownToDisplay);
  const renderedHtml = helpers.markdownToHtml({ markdown: markdownFromDisplay });
  expect(renderedHtml).toBe(html);
}

describe('HTML To Markdown Converter', () => {
  it(`convert image html tag to markdown`, () => {
    generateTest('double_underscores');
  });
  it(`convert italic html tag to markdown`, () => {
    generateTest('italic');
  });
  it(`convert bold italic html tag to markdown`, () => {
    generateTest('bold_italic');
  });
});