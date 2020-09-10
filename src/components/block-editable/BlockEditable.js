import React, {
  useMemo, useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';

import {
  markdownToHtml,
  htmlToMarkdown,
  filter,
  toDisplay,
  fromDisplay,
  isHebrew,
} from '../../core/';
import { useStyles } from './useStyles';

function BlockEditable({
  markdown,
  onEdit,
  inputFilters,
  outputFilters,
  style,
  preview,
  editable='true',
}) {
  useEffect(() => {
    const markdownEditable = document.getElementById('markdown-editable');

    if (markdownEditable) {
      let code = filter({ string: markdown, filters: inputFilters });
      code = toDisplay(code);
      markdownEditable.innerText = code;
    }

    const htmlEditable = document.getElementById('html-editable');

    if (htmlEditable) {
      htmlEditable.innerHTML = markdownToHtml({ markdown, inputFilters });
    }
  }, [inputFilters, markdown]);

  const [oldMarkdown, setOldMarkdown] = useState(markdown);
  const classes = useStyles();
  const _style = useMemo(
    () =>
      isHebrew(markdown) ? { ...style, fontSize: '1.5em' } : style,
    [style, markdown]
  );

  const handleChange = useCallback(
    (_markdown) => {
      const oldHTML = markdownToHtml({
        markdown: oldMarkdown,
        inputFilters: inputFilters,
      });
      const newHTML = markdownToHtml({
        markdown: _markdown,
        inputFilters: inputFilters,
      });

      setOldMarkdown(_markdown);

      if (oldHTML !== newHTML) {
        onEdit(_markdown);
      }
    },
    [inputFilters, oldMarkdown, onEdit]
  );

  const handleHTMLChange = useCallback(
    (e) => {
      const html = e.target.innerHTML;
      const _markdown = htmlToMarkdown({ html, outputFilters });
      handleChange(_markdown, e);
    },
    [handleChange, outputFilters]
  );


  const handleRawChange = useCallback(
    (e) => {
      let string = e.target.innerText;
      string = fromDisplay(string);
      const _markdown = filter({ string, filters: outputFilters });
      handleChange(_markdown);
    },
    [handleChange, outputFilters]
  );

  return (
    <div className={classes.root}>
      <pre className={classes.pre} style={{ display: !preview ? 'block' : 'none' }}>
        <code
          id="markdown-editable"
          dir='auto'
          style={_style}
          className={classes.markdown}
          contentEditable={editable}
          onInput={handleRawChange}
          suppressContentEditableWarning={true}
        />
      </pre>
      <div
        id="html-editable"
        dir='auto'
        style={{ ..._style, display: preview ? 'block' : 'none' }}
        className={classes.html}
        contentEditable={editable}
        onInput={handleHTMLChange}
        suppressContentEditableWarning={true}
      />
    </div>
  );
}

BlockEditable.propTypes = {
  /** Initial markdown for the editor. */
  markdown: PropTypes.string.isRequired,
  /** Function to propogate changes to the markdown. */
  onEdit: PropTypes.func,
  /** Replace strings before rendering. */
  inputFilters: PropTypes.array,
  /** Replace strings after editing. */
  outputFilters: PropTypes.array,
  /** CSS for the component. */
  style: PropTypes.object,
  /** Display Raw Markdown or HTML. */
  preview: PropTypes.bool,
  /** Enable/Disable editability. */
  editable: PropTypes.bool,
};

BlockEditable.defaultProps = {
  markdown: '',
  onEdit: () => {},
  inputFilters: [],
  outputFilters: [],
  style: {},
  preview: true,
  editable: true,
};

export default BlockEditable;
