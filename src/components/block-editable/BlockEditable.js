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
  filter,
  toDisplay,
  fromDisplay,
  isHebrew,
} from '../../core/';
import styles from './useStyles';

function BlockEditable(props) {
  const {
    markdown,
    style,
    preview,
    editable,
    inputFilters,
    outputFilters,
    onEdit,
    classes,
    debounce: debounceTime,
  } = props;

  const markdownRef = useRef(null);
  const htmlRef = useRef(null);
  const [html, setHTML] = useState(null);
  const _onEdit = useCallback(onEdit, []);
  const onEditThrottled = useCallback(debounce(_onEdit, debounceTime, { leading: false, trailing: true }), [_onEdit]);

  const handleMarkdownChange = useCallback((_markdown) => {
    if (_markdown !== '') {
      onEditThrottled(_markdown);
    }
  }, [onEditThrottled]);

  useEffect(() => {
    const _markdown = htmlToMarkdown({ html, filters: inputFilters });

    if (_markdown !== markdown) {
      handleMarkdownChange(_markdown);
    }
  }, [handleMarkdownChange, html, inputFilters, markdown]);

  useEffect(() => {
    const _html = markdownToHtml({
      markdown,
      filters: outputFilters,
    });

    if (html !== _html) {
      setHTML(_html);
    }
  }, [outputFilters, markdown, html]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const doc = new DOMParser().parseFromString(pastedData, 'text/html');
    const text = doc.body.textContent || '';
    e.target.innerHTML = text;
  }, []);

  useEffect(() => {
    const el = markdownRef.current;

    if (el) {
      el.addEventListener('paste', handlePaste);
    };
    return () => {
      if (el) {
        el.removeEventListener('paste', handlePaste);
      }
    };
  }, [handlePaste, preview]);


  const _style = isHebrew(markdown) ? { ...style, fontSize: '1.5em' } : style;
  const code = filter({ string: markdown, filters: inputFilters });
  const _markdown = toDisplay(code);
  return (
    <div className={classes.root}>
      {!preview &&
      <pre className={classes.pre}>
        <input onChange={(e) => {
          handleMarkdownChange(e.target.value);
        }} value={_markdown} dir="auto" className={classes.markdown} style={_style} ref={markdownRef} />
      </pre>
      }
      {preview &&
      <ContentEditable
        dir="auto"
        innerRef={htmlRef}
        className={classes.html}
        disabled={!editable}
        style={_style}
        html={html}
      />}
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
  /** CSS clasess from material-ui */
  classes: PropTypes.object.isRequired,
  /** Amount of time to debounce edits */
  debounce: PropTypes.number,
};

BlockEditable.defaultProps = {
  markdown: '',
  onEdit: () => {},
  inputFilters: [
    [/>/gi, '&gt;'],
    [/</gi, '&lt;'],
  ],
  outputFilters: [
    // [/&gt;/gi, '>'],
    // [/&lt;/gi, '<'],
    // [/<br>/gi, '\n'],
  ],
  style: {},
  preview: true,
  editable: true,
  debounce: 0,
};

const propsAreEqual = (prevProps, nextProps) => prevProps.preview === nextProps.preview &&
prevProps.editable === nextProps.editable &&
  isEqual(prevProps.style, nextProps.style) &&
 isEqual(prevProps.outputFilters, nextProps.outputFilters) &&
 isEqual(prevProps.inputFilters, nextProps.inputFilters) &&
prevProps.markdown === nextProps.markdown;

export default withStyles(styles)(memo(BlockEditable, propsAreEqual));
