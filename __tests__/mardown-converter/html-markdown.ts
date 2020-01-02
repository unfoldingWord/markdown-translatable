import * as helpers from '../../src/core';
import fs from 'fs';
import path from 'path';

describe('HTML To Markdown Converter', () => {
  it(`convert image html tag to markdown`, () => {
    generateTest('image');
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
});

function generateTest(fileName) {
  const markdown = fs.readFileSync(path.join(__dirname, './fixtures', `${fileName}.md`), { encoding: 'utf-8' });
  const html = fs.readFileSync(path.join(__dirname, './fixtures', `${fileName}.html`), { encoding: 'utf-8' });
  const res = helpers.htmlToMarkdown({ html });
  expect(res).toBe(markdown);
}