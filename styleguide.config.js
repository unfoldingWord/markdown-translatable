const path = require('path');
const upperFirst = require('lodash/upperFirst');
const camelCase = require('lodash/camelCase');
const { name, version } = require('./package.json');
const { styles, theme } = require('./styleguide.styles');

module.exports = {
  propsParser: require('react-docgen-typescript').withCustomConfig('./tsconfig.json').parse,
  title: `${upperFirst(camelCase(name))} v${version}`,
  ribbon: {
    url: 'https://github.com/unfoldingWord-box3/markdown-translatable',
    text: 'View me on GitHub'
  },
  webpackConfig: {
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader',
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ]
        }
      ]
    }
  },
  styles,
  theme,
  getComponentPathLine: (componentPath) => {
    const dirname = path.dirname(componentPath, '.js');
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
        path.resolve(__dirname, `src/components/translatable`, `Translatable.js`),
      ]),
    },
    {
      name: 'Document Translatable',
      components: () => ([
        path.resolve(__dirname, `src/components/document-translatable`, `DocumentTranslatable.js`),
      ]),
    },
    {
      name: 'Section Translatable',
      components: () => ([
        path.resolve(__dirname, `src/components/section-translatable`, `SectionTranslatable.js`),
      ]),
    },
    {
      name: 'Block Translatable',
      components: () => ([
        path.resolve(__dirname, `src/components/block-translatable`, `BlockTranslatable.js`),
      ]),
    },
    {
      name: 'Block Editable',
      components: () => ([
        path.resolve(__dirname, `src/components/block-editable`, `BlockEditable.js`),
      ]),
    },
    {
      name: 'Actions',
      components: () => ([
        path.resolve(__dirname, `src/components/actions`, `Actions.js`),
      ]),
    },
  ]
};
