import React from 'react';
import PropTypes from 'prop-types';

import * as helpers from './helpers';

/**
 * ### A reusable component for editing Markdown as HTML.
 * @component
 */
export default function MarkdownHtmlEditable({
  markdown,
  handleChange,
  inputFilters,
  outputFilters,
  style,
  raw,
}) {
  let component;

  let _style = {...style};
  if (raw) {
    _style = {
      whiteSpace: 'pre-wrap',
      fontSize: '1.2em',
    }
    style = {..._style, ...style};
  }

  if (raw) {
    component = (
      <pre
        style={style}
        dir="auto"
        contentEditable
        onBlur={(e)=>{
          const _markdown = helpers.filter({
            string: e.target.innerText,
            filters: outputFilters
          });
          handleChange(_markdown);
        }}
        dangerouslySetInnerHTML={
          { __html: markdown }
        }
      />
    );
  } else {
    component = (
      <div
        style={style}
        dir="auto"
        contentEditable
        dangerouslySetInnerHTML={{
          __html: helpers.markdownToHtml({markdown, inputFilters})
        }}
        onBlur={(e)=>{
          const html = e.target.innerHTML;
          const _markdown = helpers.htmlToMarkdown({html, outputFilters});
          handleChange(_markdown);
        }}
      />
    );
  }
  return component;
};

MarkdownHtmlEditable.propTypes = {
  /** Initial markdown for the editor. */
  markdown: PropTypes.string.isRequired,
  /** Function to propogate changes to the markdown. */
  handleChange: PropTypes.func.isRequired,
  /** Replace strings before rendering. */
  inputFilters: PropTypes.array,
  /** Replace strings after editing. */
  outputFilters: PropTypes.array,
  /** CSS for the component. */
  style: PropTypes.object,
  /** Display Raw Markdown or HTML. */
  raw: PropTypes.bool,
};

MarkdownHtmlEditable.defaultProps = {
  markdown: '',
  handleChange: () => {},
  inputFilters: [],
  outputFilters: [],
  style: {},
  raw: false,
};
