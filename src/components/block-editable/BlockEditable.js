import React, { memo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import ContentEditable from 'react-contenteditable';
import { withStyles } from '@material-ui/core';
import {
  markdownToHtml,
  htmlToMarkdown,
  isHebrew,
  fromDisplay,
  toDisplay,
} from '../../core/';
import styles from './useStyles';
import {
  useHandleUndo, useHandlePaste, useFixCursorOnNewLine,
} from './helpers';

/**
 * Note: The markdown state is handled within the
 * component and changes are propagated up to the parent
 */
function BlockEditable({
  markdown,
  style,
  preview,
  editable,
  onEdit,
  classes,
  onBlur,
}) {
  const markdownRef = useRef();
  const [html, setHTML] = useState(markdownToHtml({
    markdown
  }))
  /** Cursor will get reset after pressing Enter key,
   * this will watch the cursor state and fix it after */
  useFixCursorOnNewLine(markdownRef.current);
  /** Manage undo state and listeners because content editable*/
  useHandleUndo(markdownRef.current, markdown);
  /** Because we are not using normal inputs we need
   * to hijack the paste event and insert it manually
   * into the markdown div */
  useHandlePaste(markdownRef.current, preview);
  /** onEdit is called on each change which can
   * lead to performance issues when changing rapidly.
   * The debounce is optional, if not set it will remain at 0 and
   * function as normal */
  // const onEditThrottled = useCallback(debounce(onEdit, debounceTime, { leading: false, trailing: true }), [onEdit]);

  function handleHTMLChange(value) {
    setHTML(value);
    const newMarkdown = htmlToMarkdown({
      html: value,
    });
    onEdit(newMarkdown);
  }

  function handleMarkdownChange(value) {
    onEdit(value);
    const newHTML = markdownToHtml({
      markdown: value,
    });
    setHTML(newHTML);
  }

  const _style = isHebrew(markdown) ? { ...style, fontSize: '1.5em' } : style;
  console.log("markdown", markdown);
  return (
    <div className={classes.root}>
      <pre style={{ display: !preview ? 'block' : 'none' }} className={classes.pre}>
        <ContentEditable
          onBlur={() => onBlur(markdown)}
          disabled={!editable}
          onChange={(e) => handleMarkdownChange(e.target.value)}
          html={markdown}
          dir="auto"
          className={classes.markdown}
          style={_style}
          innerRef={markdownRef} />
      </pre>
      <ContentEditable
        dir="auto"
        className={classes.html}
        disabled={!editable}
        style={{ ..._style, display: preview ? 'block' : 'none' }}
        html={html}
        onChange={(e) => handleHTMLChange(e.target.value)}
      />
    </div>
  );
}

BlockEditable.propTypes = {
  /** Initial markdown for the editor. */
  markdown: PropTypes.string.isRequired,
  /** Debounced callback containing the value
   * of the markdown, called on every change */
  onEdit: PropTypes.func,
  /** Replace strings before rendering. */
  inputFilters: PropTypes.array,
  /** Replace strings after editing. */
  outputFilters: PropTypes.array,
  /** CSS for the component. */
  style: PropTypes.object,
  /** If true will display the rendered HTML of the markdown
   * text */
  preview: PropTypes.bool,
  /** Enable/Disable editability. */
  editable: PropTypes.bool,
  /** CSS classes from material-ui */
  classes: PropTypes.object.isRequired,
  /** Amount of time to debounce edits */
  debounce: PropTypes.number,
  /** Debounced callback containing the value
   * of the markdown, called on blur */
  onBlur: PropTypes.func,
};

BlockEditable.defaultProps = {
  markdown: '',
  onBlur: () => { },
  onEdit: () => { },
  inputFilters: [],
  outputFilters: [],
  style: {},
  preview: true,
  editable: true,
  debounce: 200,
};

const propsAreEqual = (prevProps, nextProps) => prevProps.preview === nextProps.preview &&
  prevProps.editable === nextProps.editable &&
  isEqual(prevProps.style, nextProps.style) &&
  isEqual(prevProps.outputFilters, nextProps.outputFilters) &&
  isEqual(prevProps.inputFilters, nextProps.inputFilters) &&
  prevProps.markdown === nextProps.markdown;

export default withStyles(styles)(memo(BlockEditable, propsAreEqual));
