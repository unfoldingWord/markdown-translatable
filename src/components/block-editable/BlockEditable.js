import React, {
  useRef, useState , useEffect, memo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import debounce from 'lodash.debounce';
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
import { useHandleUndo, useHandlePaste } from './helpers';

/**
 * Note: The markdown state is handled within the
 * component and changes are propagated up to the parent
 */
function BlockEditable(props) {
  const {
    markdown: _markdown,
    style,
    preview,
    editable,
    inputFilters,
    outputFilters,
    onEdit,
    classes,
    debounce: debounceTime,
    onBlur,
  } = props;

  const markdownRef = useRef(null);
  const [markdown, setMarkdown] = useState(_markdown);
  const [html, setHTML] = useState(null);
  useHandleUndo(markdownRef.current);
  useHandlePaste(markdownRef.current, preview);
  /** onEdit is called on each change which can
   * lead to performance issues when changing rapidly.
   * The debounce is optional, if not set it will remain at 0 and
   * function as normal */
  const onEditThrottled = useCallback(debounce(onEdit, debounceTime, { leading: false, trailing: true }), [onEdit]);

  /** Helper function to update the markdown state and
   * send changes to the callback as well */
  const handleMarkdownChange = useCallback((value) => {
    onEditThrottled(value);
    setMarkdown(value);
  }, [onEditThrottled]);

  useEffect(() => {
    if (preview) {
      const newHTML = markdownToHtml({
        markdown,
        filters: inputFilters,
      });

      setHTML(newHTML);
    }
  }, [html, inputFilters, markdown, preview]);

  useEffect(() => {
    if (!preview && html !== null) {
      const newMarkdown = htmlToMarkdown({
        html,
        filters: outputFilters,
      });

      setMarkdown(newMarkdown);
    }
  }, [html, outputFilters, preview]);

  const _style = isHebrew(markdown) ? { ...style, fontSize: '1.5em' } : style;
  const markdownDisplay = toDisplay(markdown);
  return (
    <div className={classes.root}>
      {!preview &&
      <pre className={classes.pre}>
        <ContentEditable
          onBlur={() => onBlur(markdownDisplay)}
          disabled={!editable}
          onChange={(e) => handleMarkdownChange(fromDisplay(e.target.value))}
          html={markdownDisplay}
          dir="auto"
          className={classes.markdown}
          style={_style}
          innerRef={markdownRef} />
      </pre>
      }
      {preview &&
      <ContentEditable
        dir="auto"
        className={classes.html}
        disabled={!editable}
        style={_style}
        html={html}
        onChange={(e) => setHTML(e.target.value)}
      />}
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
  onBlur: () => {},
  onEdit: () => {},
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
