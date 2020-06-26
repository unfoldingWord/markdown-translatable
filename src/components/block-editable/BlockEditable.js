import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import * as helpers from '../../core/';
import {
  markdownToHtml,
  htmlToMarkdown,
  filter,
  toDisplay,
  fromDisplay,
} from '../../core/';
import { useStyles } from './useStyles';

function BlockEditable({
  markdown,
  onEdit,
  inputFilters,
  outputFilters,
  style,
  preview,
  editable,
}) {
  const _oldMarkdown = { markdown };

  const classes = useStyles();

  const _style = useMemo(
    () =>
      helpers.isHebrew(markdown) ? { ...style, fontSize: '1.5em' } : style,
    [style, markdown]
  );

  const handleBlur = useCallback(
    (_markdown) => {
      const oldHTML = markdownToHtml({
        markdown: _oldMarkdown.markdown,
        inputFilters: inputFilters,
      });
      const newHTML = markdownToHtml({
        markdown: _markdown,
        inputFilters: inputFilters,
      });

      _oldMarkdown.markdown = _markdown;

      if (oldHTML !== newHTML) onEdit(_markdown);
    },
    [markdown, inputFilters, onEdit]
  );

  const handleHTMLBlur = useCallback(
    (e) => {
      const html = e.target.innerHTML;
      const _markdown = htmlToMarkdown({ html, outputFilters });
      handleBlur(_markdown);
    },
    [handleBlur, outputFilters]
  );

  const handleRawBlur = useCallback(
    (e) => {
      let string = e.target.innerText;
      string = fromDisplay(string);
      const _markdown = filter({ string, filters: outputFilters });
      handleBlur(_markdown);
    },
    [handleBlur, outputFilters]
  );

  const component = useMemo(() => {
    let _component;

    if (!preview) {
      let code = filter({ string: markdown, filters: inputFilters });
      code = toDisplay(code);
      const dangerouslySetInnerHTML = { __html: code };

      _component = (
        <pre className={classes.pre}>
          <code
            className={classes.markdown}
            style={_style}
            dir='auto'
            contentEditable={editable}
            onBlur={handleRawBlur}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
          />
        </pre>
      );
    } else {
      const dangerouslySetInnerHTML = {
        __html: markdownToHtml({ markdown, inputFilters }),
      };

      _component = (
        <div
          style={_style}
          className={classes.html}
          dir='auto'
          contentEditable={editable}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
          onBlur={handleHTMLBlur}
        />
      );
    }
    return _component;
  }, [preview, markdown, editable]);

  return <div className={classes.root}>{component}</div>;
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
