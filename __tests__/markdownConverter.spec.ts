import * as helpers from '../src/core';

const test_data: string[][] = [
  [`<img src="https://cdn.door43.org/assets/uw-icons/logo-obs-256.png" alt="drawing" width="100"/>
  # unfoldingWord® Open Bible Stories`, `![drawing](https://cdn.door43.org/assets/uw-icons/logo-obs-256.png) # unfoldingWord® Open Bible Stories`]
];

describe('Markdown Converter', () => {
  test_data.forEach(([html, markdown]) => {
    it('testing proper conversion', () => {
      const res = helpers.htmlToMarkdown({ html });
      expect(res).toBe(markdown);
    });
  });
});