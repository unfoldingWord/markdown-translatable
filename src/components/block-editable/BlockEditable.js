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
  onEdit,
  inputFilters,
  outputFilters,
  style,
  raw,
  editable,
}) {
  let component;

  if (raw) {
    component = (
      <div
        className={classes.markdown}
      >
        <pre
          className={classes.pre}
          dir="auto"
          contentEditable={editable}
          onBlur={(e)=>{
            const _markdown = helpers.filter({
              string: e.target.innerText,
              filters: outputFilters
            });
            onEdit(_markdown);
          }}
          dangerouslySetInnerHTML={
            { __html: markdown }
          }
        />
      </div>
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
          onEdit(_markdown);
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
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** Initial markdown for the editor. */
  markdown: PropTypes.string.isRequired,
  /** Function to propogate changes to the markdown. */
  onEdit: PropTypes.func.isRequired,
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
  onEdit: () => {},
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
    padding: '0 0.5em',
  },
  html: {
    height: '100%',
    width: '100%',
    display: 'grid',
  },
  markdown: {
    height: '100%',
    width: '100%',
    fontSize: '1.1em',
    display: 'grid',
  },
  pre: {
    whiteSpace: 'pre-wrap',
  },
});

export default withStyles(styles)(BlockEditable);
