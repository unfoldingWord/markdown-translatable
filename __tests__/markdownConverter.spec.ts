import * as helpers from '../src/core';

const test_data: string[][] = [
  [`<img src="https://cdn.door43.org/assets/uw-icons/logo-obs-256.png" alt="drawing" width="100"/>
  # unfoldingWord® Open Bible Stories`,
    `![drawing](https://cdn.door43.org/assets/uw-icons/logo-obs-256.png) # unfoldingWord® Open Bible Stories`],
  [`<h1>This is an h1</h1>
   <h2>This is a sub-heading or an h2</h2>
   <h5>This is an h5 since the amount of hashes correspond to a subheading’s number.</h5>
  `, `# This is an h1

## This is a sub-heading or an h2

##### This is an h5 since the amount of hashes correspond to a subheading’s number.`],
  [`<ul>
<li>One item</li>
<li>Another item<ul>
<li>A sub-item<ul>
<li>A deeper item</li>
</ul>
</li>
<li>Back in sub-item land</li>
</ul>
</li>
<li>And back at the main level</li>
</ul>
`, `*   One item
*   Another item
    *   A sub-item
        *   A deeper item
    *   Back in sub-item land
*   And back at the main level`],
  [`<ul>
<li>One item</li>
<li>Another item<ol>
<li>A nested ordered list</li>
<li>This is the second item<ul>
<li>And now an unordered list as its child</li>
<li>Another item in this list</li>
</ul>
</li>
<li>One more in the ordered list</li>
</ol>
</li>
<li>And back at the main level</li>
</ul>
`, `*   One item
*   Another item
    1.  A nested ordered list
    2.  This is the second item
        *   And now an unordered list as its child
        *   Another item in this list
    3.  One more in the ordered list
*   And back at the main level`],
  [`<blockquote>
<p>This is some part of a blockquote.
Some more stuff.</p>
</blockquote>
`, `> This is some part of a blockquote. Some more stuff.`],
  [`<p>Images with the full URL: <img src="https://placebear.com/300/300" alt="alt text"></p>`,
    `Images with the full URL: ![alt text](https://placebear.com/300/300)`],
  [`<p>*literal asterisks*</p>`, `\\*literal asterisks\\*`],
  [`<p><em>This text will be italic</em>
  <em>This will also be italic</em>
  <strong>This text will be bold</strong>
  <strong>This will also be bold</strong>
  <em>You <strong>can</strong> combine them</em></p>`, `*This text will be italic* *This will also be italic* **This text will be bold** **This will also be bold** *You **can** combine them*`],
  [`<ul>
  <li>[x] this is a complete item</li>
  <li>[ ] this is an incomplete item</li>
  <li>[x] @mentions, #refs, <a href="">links</a>,
  <strong>formatting</strong>, and <del>tags</del>
  supported</li>
  <li>[x] list syntax required (any
  unordered or ordered list
  supported)</li>
  </ul>
  `, `*   \\[x\\] this is a complete item
*   \\[ \\] this is an incomplete item
*   \\[x\\] @mentions, #refs, links, **formatting**, and ~tags~ supported
*   \\[x\\] list syntax required (any unordered or ordered list supported)`],
  [`<p>Colons can be used to align columns.</p>
  <table>
  <thead>
  <tr>
  <th>Tables</th>
  <th style="text-align:center">Are</th>
  <th style="text-align:right">Cool</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td>col 3 is</td>
  <td style="text-align:center">right-aligned</td>
  <td style="text-align:right">$1600</td>
  </tr>
  <tr>
  <td>col 2 is</td>
  <td style="text-align:center">centered</td>
  <td style="text-align:right">$12</td>
  </tr>
  <tr>
  <td>zebra stripes</td>
  <td style="text-align:center">are neat</td>
  <td style="text-align:right">$1</td>
  </tr>
  </tbody>
  </table>
  <p>There must be at least 3 dashes separating each header cell.
  The outer pipes (|) are optional, and you don&#39;t need to make the 
  raw Markdown line up prettily. You can also use inline Markdown.</p>
  <table>
  <thead>
  <tr>
  <th>Markdown</th>
  <th>Less</th>
  <th>Pretty</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td><em>Still</em></td>
  <td><code>renders</code></td>
  <td><strong>nicely</strong></td>
  </tr>
  <tr>
  <td>1</td>
  <td>2</td>
  <td>3</td>
  </tr>
  </tbody>
  </table>`, `Colons can be used to align columns.

| Tables | Are | Cool |
| --- | --- | --- |
| col 3 is | right-aligned | $1600 |
| col 2 is | centered | $12 |
| zebra stripes | are neat | $1 |

There must be at least 3 dashes separating each header cell. The outer pipes (|) are optional, and you don't need to make the raw Markdown line up prettily. You can also use inline Markdown.

| Markdown | Less | Pretty |
| --- | --- | --- |
| *Still* | \`renders\` | **nicely** |
| 1 | 2 | 3 |`],
  [`<dl>
<dt>Definition list</dt>
<dd>Is something people use sometimes.</dd>

<dt>Markdown in HTML</dt>
<dd>Does <em>not</em> work <strong>very</strong> well. Use HTML <em>tags</em>.</dd>
</dl>`, `Definition list

Is something people use sometimes.

Markdown in HTML

Does *not* work **very** well. Use HTML *tags*.`]
];

describe('Markdown Converter', () => {
  test_data.forEach(([html, markdown]) => {
    it(`convert html to markdown`, () => {
      const res = helpers.htmlToMarkdown({ html });
      expect(res).toBe(markdown);
    });
  });
});