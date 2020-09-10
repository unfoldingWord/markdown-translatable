import React, {
  useRef, useState , useEffect, memo,
} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
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
  } = props;
  const markdownEditable = useRef(null);
  const htmlEditable = useRef(null);

  const [markdownDisplay, setMarkdownDisplay] = useState('');
  const [htmlDisplay, setHtmlDisplay] = useState(markdownToHtml({ markdown, inputFilters }));

  useEffect(() => {
    const code = filter({ string: markdown, filters: inputFilters });
    const _markdownDisplay = toDisplay(code);
    setMarkdownDisplay(_markdownDisplay);
  }, [inputFilters, markdown]);


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
      onEdit(newMarkdown);
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


  const _style = isHebrew(markdown) ? { ...style, fontSize: '1.5em' } : style;
  return (
    <div className={classes.root}>
      <pre className={classes.pre} style={{ display: !preview ? 'block' : 'none' }}>
        <ContentEditable
          style={{ ..._style, display: !preview ? 'block' : 'none' }}
          innerRef={markdownEditable}
          disabled={!editable}
          html={markdownDisplay} // innerHTML of the editable div
          onChange={handleRawChange} // handle innerHTML change
          tagName='code'
        />
      </pre>
      <ContentEditable
        disabled={!editable}
        style={{ ..._style, display: preview ? 'block' : 'none' }}
        innerRef={htmlEditable}
        html={htmlDisplay} // innerHTML of the editable div
        onChange={handleHTMLChange} // handle innerHTML change
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
  /** CSS clasess from material-ui */
  classes: PropTypes.object.isRequired,
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

const propsAreEqual = (prevProps, nextProps) => prevProps.preview === nextProps.preview &&
prevProps.editable === nextProps.editable &&
  isEqual(prevProps.style, nextProps.style) &&
 isEqual(prevProps.outputFilters, nextProps.outputFilters) &&
 isEqual(prevProps.inputFilters, nextProps.inputFilters) &&
prevProps.markdown === nextProps.markdown;

export default withStyles(styles)(memo(BlockEditable, propsAreEqual));
