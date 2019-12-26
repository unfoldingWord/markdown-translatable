const Path = require('path');
const upperFirst = require('lodash/upperFirst');
const camelCase = require('lodash/camelCase');
const { name, version } = require('./package.json');
const { styles, theme } = require('./styleguide.styles');

module.exports = {
  title: `${upperFirst(camelCase(name))} v${version}`,
  ribbon: {
    url: 'https://github.com/unfoldingWord-box3/markdown-translatable',
    text: 'View me on GitHub'
  },
  webpackConfig: require('react-scripts/config/webpack.config')('development'),
  styles,
  theme,
  getComponentPathLine: (componentPath) => {
    const dirname = Path.dirname(componentPath, '.js');
    const file = dirname.split('/').slice(-1)[0];
    const componentName = upperFirst(camelCase(file));
    return `import { ${componentName} } from "${name}";`;
  },
  usageMode: 'expand',
  exampleMode: 'expand',
  pagePerSection: true,
  sections: [
    {
      name: 'Translatable',
      components: () => ([
        Path.resolve(__dirname, `src/components/translatable`, `Translatable.js`),
      ]),
    },
    {
      name: 'Document Translatable',
      components: () => ([
        Path.resolve(__dirname, `src/components/document-translatable`, `DocumentTranslatable.js`),
      ]),
    },
    {
      name: 'Section Translatable',
      components: () => ([
        Path.resolve(__dirname, `src/components/section-translatable`, `SectionTranslatable.js`),
      ]),
    },
    {
      name: 'Block Translatable',
      components: () => ([
        Path.resolve(__dirname, `src/components/block-translatable`, `BlockTranslatable.js`),
      ]),
    },
    {
      name: 'Block Editable',
      components: () => ([
        Path.resolve(__dirname, `src/components/block-editable`, `BlockEditable.js`),
      ]),
    },
    {
      name: 'Actions',
      components: () => ([
        Path.resolve(__dirname, `src/components/actions`, `Actions.js`),
      ]),
    },
  ]
};
