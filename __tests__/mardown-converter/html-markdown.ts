import fs from 'fs';
import path from 'path';
import * as helpers from '../../src/core';

function generateTest(fileName: string) {
  let markdown = fs.readFileSync(path.join(__dirname, './fixtures', `${fileName}.md`), { encoding: 'utf-8' });
  const html = fs.readFileSync(path.join(__dirname, './fixtures', `${fileName}.html`), { encoding: 'utf-8' });
  const res = helpers.htmlToMarkdown({ html });
  const markdownToDisplay = helpers.toDisplay(res);
  let fromDisplay = helpers.fromDisplay(markdownToDisplay);

  // Ignore differences in linebreak formats:
  markdown = markdown.replace(/\r\n/g, '\n');
  fromDisplay = fromDisplay.replace(/\r\n/g, '\n');

  expect(fromDisplay).toBe(markdown);
}

describe('HTML To Markdown Converter', () => {
  it(`convert image html tag to markdown`, () => {
    generateTest('image');
  });

  it(`convert underline tags`, () => {
    generateTest('double_underscores');
  });

  it(`convert heading html tags to markdown`, () => {
    generateTest('heading');
  });

  it(`convert list html tags to markdown`, () => {
    generateTest('lists');
  });

  it(`convert nested lists html tags to markdown`, () => {
    generateTest('nested_lists');
  });

  it(`convert blockquote html tags to markdown`, () => {
    generateTest('blockquote');
  });

  it(`convert literal asterisks html tags to markdown`, () => {
    generateTest('literal_asterisks');
  });

  it(`convert italic and strong html tags to markdown`, () => {
    generateTest('italic_strong');
  });

  it(`convert checkbox html tags to markdown`, () => {
    generateTest('checkbox');
  });

  it(`convert table html tags to markdown`, () => {
    generateTest('table');
  });

  it(`convert definition list html tags to markdown`, () => {
    generateTest('definition_list');
  });

  it(`convert bold italic html markdown`, () => {
    generateTest('bold_italic');
  });
  it(`convert occurrence note html markdown`, () => {
    generateTest('occurrence-note-1');
  });

  it(`convert RC link html markdown`, () => {
    generateTest('rc-link');
  });
  
  it(`convert hyperlink html to markdown`, () => {
    generateTest('hyperlink');
  });
});