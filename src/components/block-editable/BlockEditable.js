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

  const [markdownDisplay, setMarkdownDisplay] = useState('');
  const [htmlDisplay, setHtmlDisplay] = useState(markdownToHtml({ markdown, inputFilters }));

  useEffect(() => {
    const code = filter({ string: markdown, filters: inputFilters });
    const _markdownDisplay = toDisplay(code);
    setMarkdownDisplay(_markdownDisplay);
  }, [inputFilters, markdown]);

  const _onEdit = useCallback(onEdit, []);
  const onEditThrottled = useCallback(debounce(_onEdit, debounceTime, { leading: false, trailing: true }), [_onEdit]);

  function handleChange(newMarkdown) {
    const oldHTML = markdownToHtml({
      markdown,
      inputFilters: inputFilters,
    });
    const newHTML = markdownToHtml({
      markdown: newMarkdown,
      inputFilters: inputFilters,
    });


    if (oldHTML !== newHTML) {
      onEditThrottled(newMarkdown);
      const code = filter({ string: newMarkdown, filters: inputFilters });
      setMarkdownDisplay(toDisplay(code));
      setHtmlDisplay(newHTML);
    }
  }

  function handleHTMLChange(e) {
    const html = e.target.value;
    const _markdown = htmlToMarkdown({ html, outputFilters });
    handleChange(_markdown, e);
  }


  function handleRawChange(e) {
    let string = e.target.value;
    string = fromDisplay(string);
    const _markdown = filter({ string, filters: outputFilters });
    handleChange(_markdown);
  }

useEffect(() => {
  const el = markdownRef.current;
  if (el) {
    el.addEventListener("paste", function(e) {
    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    var text = e.clipboardData.getData("text/plain");

    // insert text manually
    document.execCommand("insertHTML", false, text);
  })
};
}, [markdownRef.current, preview])


  const _style = isHebrew(markdown) ? { ...style, fontSize: '1.5em' } : style;

  return (
    <div  className={classes.root}>
      {!preview &&
      <pre className={classes.pre}>
        <ContentEditable
          innerRef={markdownRef}
          dir="auto"
          className={classes.markdown}
          style={_style}
          html={markdownDisplay}
          disabled={!editable}
          onChange={handleRawChange}
          />
      </pre>
      }
      {preview &&
      <ContentEditable
        dir="auto"
        innerRef={htmlRef}
        className={classes.html}
        disabled={!editable}
        style={_style}
        html={htmlDisplay}
        onChange={handleHTMLChange}
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
  inputFilters: [],
  outputFilters: [],
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
