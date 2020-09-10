import React from 'react';
import PropTypes from 'prop-types';
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

class BlockEditable extends React.Component {
  constructor(props) {
    super(props);
    const { markdown, inputFilters } = props;
    this.state = { oldMarkdown: props.markdown, html: markdownToHtml({ markdown, inputFilters }) };
    this.handleHTMLChange = this.handleHTMLChange.bind(this);
    this.handleRawChange = this.handleRawChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setInnerText = this.setInnerText.bind(this);
    this.markdownEditable = React.createRef();
    this.htmlEditable = React.createRef();
  }

  setInnerText() {
    const { markdown, inputFilters } = this.props;

    if (this.markdownEditable.current) {
      let code = filter({ string: markdown, filters: inputFilters });
      code = toDisplay(code);
      this.markdownEditable.current.innerText = code;
    }
  }

  handleChange(_markdown) {
    const { inputFilters } = this.props;

    const oldHTML = markdownToHtml({
      markdown: this.state.oldMarkdown,
      inputFilters: inputFilters,
    });
    const newHTML = markdownToHtml({
      markdown: _markdown,
      inputFilters: inputFilters,
    });

    this.setState({ oldMarkdown:_markdown });

    if (oldHTML !== newHTML) {
      this.props.onEdit(_markdown);
      this.setState({ html: markdownToHtml({ markdown: _markdown, inputFilters }) });
    }
  }

  handleHTMLChange(e) {
    const { outputFilters } = this.props;
    const html = e.target.value;
    const _markdown = htmlToMarkdown({ html, outputFilters });
    this.handleChange(_markdown, e);
  }


  handleRawChange(e) {
    const { outputFilters } = this.props;
    let string = e.target.value;
    string = fromDisplay(string);
    const _markdown = filter({ string, filters: outputFilters });
    this.handleChange(_markdown);
  }


  render() {
    const {
      markdown,
      style,
      preview,
      editable='true',
      classes,
    } = this.props;
    const _style = isHebrew(markdown) ? { ...style, fontSize: '1.5em' } : style;
    return (
      <div className={classes.root}>
        <pre className={classes.pre} style={{ display: !preview ? 'block' : 'none' }}>
          <ContentEditable
            style={{ ..._style, display: !preview ? 'block' : 'none' }}
            innerRef={this.markdownEditable}
            disabled={editable}
            html={markdown} // innerHTML of the editable div
            onChange={this.handleRawChange} // handle innerHTML change
            tagName='code'
          />
        </pre>
        <ContentEditable
          disabled={editable}
          style={{ ..._style, display: preview ? 'block' : 'none' }}
          innerRef={this.htmlEditable}
          html={this.state.html} // innerHTML of the editable div
          onChange={this.handleHTMLChange} // handle innerHTML change
        />
      </div>
    );
  }
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

export default withStyles(styles)(BlockEditable);
