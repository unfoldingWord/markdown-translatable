import React, {
  memo, useState, useRef,
} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import ContentEditable from 'react-contenteditable';
import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {
  markdownToHtml,
  htmlToMarkdown,
  isHebrew,
  fromDisplay,
  toDisplay,
} from '../../core/';
import styles from './useStyles';
import { useHandleUndo, useHandlePaste } from './helpers';


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
  const [html, setHTML] = useState(markdownToHtml({ markdown }));
  /** Manage undo state and listeners because content editable*/
  // useHandleUndo(markdownRef.current, markdown);
  /** Because we are not using normal inputs we need
   * to hijack the paste event and insert it manually
   * into the markdown div */
  // useHandlePaste(markdownRef.current, preview);
  /** onEdit is called on each change which can
   * lead to performance issues when changing rapidly.
   * The debounce is optional, if not set it will remain at 0 and
   * function as normal */

  function handleHTMLChange(value) {
    setHTML(value);
    const newMarkdown = htmlToMarkdown({ html: value });
    onEdit(newMarkdown);
  }

  function handleMarkdownChange(_markdown) {
    debugger;
    onEdit(_markdown);
    const newHTML = markdownToHtml({ markdown: _markdown });
    setHTML(newHTML);
  }

  const _style = isHebrew(markdown) ? { ...style, fontSize: '1.5em' } : style;
  return (
    <div className={classes.root}>
      <TextField
        // InputProps={{ disableUnderline: true }}
        multiline
        // style={{ display: !preview ? 'grid' : 'none', ..._style }}
        // onBlur={() => onBlur(markdown)}
        // disabled={!editable}
        onChange={(e) => onEdit(e.target.value)}
        value={markdown}
      // dir="auto"
      // className={classes.markdown}
      // ref={markdownRef}
      />
      {/* <ContentEditable
        dir="auto"
        className={classes.html}
        disabled={!editable}
        style={{ ..._style, display: preview ? 'grid' : 'none', color: 'black' }}
        html={html}
        onChange={(e) => handleHTMLChange(e.target.value)}
      /> */}
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
