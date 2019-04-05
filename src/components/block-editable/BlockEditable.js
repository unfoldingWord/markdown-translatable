import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import * as helpers from './helpers';

/**
 * ### A reusable component for translating a Markdown block as HTML.
 * @component
 */
function BlockEditable({
  classes,
  markdown,
  handleChange,
  inputFilters,
  outputFilters,
  style,
  raw,
  editable,
}) {
  let component;

  if (raw) {
    component = (
      <pre
        className={classes.markdown}
        dir="auto"
        contentEditable={editable}
        onBlur={(e)=>{
          const _markdown = helpers.filter({
            string: e.target.innerText,
            filters: outputFilters
          });
          handleChange(_markdown);
        }}
        dangerouslySetInnerHTML={
          { __html: markdown }
        }
      />
    );
  } else {
    component = (
      <div
        className={classes.html}
        dir="auto"
        contentEditable={editable}
        dangerouslySetInnerHTML={{
          __html: helpers.markdownToHtml({markdown, inputFilters})
        }}
        onBlur={(e)=>{
          const html = e.target.innerHTML;
          const _markdown = helpers.htmlToMarkdown({html, outputFilters});
          handleChange(_markdown);
        }}
      />
    );
  }
  return (
    <div
      className={classes.root}
      style={style}
    >
      <div
        className={classes.wrapper}
      >
        {component}
      </div>
    </div>
  );
};

BlockEditable.propTypes = {
  /** Initial markdown for the editor. */
  markdown: PropTypes.string.isRequired,
  /** Function to propogate changes to the markdown. */
  handleChange: PropTypes.func.isRequired,
  /** Replace strings before rendering. */
  inputFilters: PropTypes.array,
  /** Replace strings after editing. */
  outputFilters: PropTypes.array,
  /** CSS for the component. */
  style: PropTypes.object,
  /** Display Raw Markdown or HTML. */
  raw: PropTypes.bool,
  /** Enable/Disable editability. */
  editable: PropTypes.bool,
};

BlockEditable.defaultProps = {
  markdown: '',
  handleChange: () => {},
  inputFilters: [],
  outputFilters: [],
  style: {},
  raw: false,
  editable: true,
};

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  wrapper: {
    height: '100%',
    margin: '0 0.5em',
  },
  html: {
    height: '100%',
    width: '100%',
    padding: '0 0.1em',
  },
  markdown: {
    height: '100%',
    width: '100%',
    whiteSpace: 'pre-wrap',
    fontSize: '1.2em',
    padding: '0 0.1em',
  }
});

export default withStyles(styles)(BlockEditable);
