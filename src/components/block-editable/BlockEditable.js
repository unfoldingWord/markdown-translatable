import React, {useMemo, useCallback} from 'react';
import PropTypes from 'prop-types';

import * as helpers from '../../core/';
import { markdownToHtml, htmlToMarkdown, filter } from '../../core/';
import {useStyles} from './useStyles';

function BlockEditable({
  markdown,
  onEdit,
  inputFilters,
  outputFilters,
  style,
  preview,
  editable,
}) {
  const classes = useStyles();

  let _style = useMemo(() => (
    helpers.isHebrew(markdown) ? {...style, fontSize: '1.5em'} : style
  ), [style, markdown]);

  const handleBlur = useCallback((_markdown) => {
    const oldHTML = markdownToHtml({ markdown, inputFilters });
    const newHTML = markdownToHtml({ markdown: _markdown, inputFilters });
    if (oldHTML !== newHTML) onEdit(_markdown);
  }, [markdown, inputFilters]);

  const handleHTMLBlur = useCallback((e) => {
    const html = e.target.innerHTML;
    const _markdown = htmlToMarkdown({ html, outputFilters });
    handleBlur(_markdown);
  }, [outputFilters]);

  const handleRawBlur = useCallback((e) => {
    const string = e.target.innerText//.replace(/&lt;/g, '<').replace(/&amp;/g, '&');
    const _markdown = filter({string, filters: outputFilters});
    handleBlur(_markdown);
  }, [outputFilters]);

  const component = useMemo(() => {
    let _component;
    if (!preview) {
      const code = filter({ string: markdown, filters: inputFilters })//.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      const dangerouslySetInnerHTML = { __html: code };
      _component = (
        <pre className={classes.pre}>
          <code
            className={classes.markdown}
            style={_style}
            dir="auto"
            contentEditable={editable}
            onBlur={handleRawBlur}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
          />
        </pre>
      );
    } else {
      const dangerouslySetInnerHTML = { __html: markdownToHtml({ markdown, inputFilters }) };
      _component = (
        <div
          style={_style}
          className={classes.html}
          dir="auto"
          contentEditable={editable}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
          onBlur={handleHTMLBlur}
        />
      );
    }
    return _component;
  }, [preview, markdown, inputFilters, editable, handleHTMLBlur, handleRawBlur, _style]);

  return (
    <div className={classes.root}>
      {component}
    </div>
  );
};

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
