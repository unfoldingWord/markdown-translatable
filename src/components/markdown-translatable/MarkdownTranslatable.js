import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
} from '@material-ui/core';
import MarkdownEditable from '../markdown-editable';

/**
 * ### A reusable component for translating Markdown as HTML.
 * @component
 */
function MarkdownTranslatable({
  classes,
  original,
  translation,
  handleChange,
  inputFilters,
  outputFilters,
  style,
  raw,
}) {
  return (
    <Grid
      container
      wrap="nowrap"
      spacing={0}
      className={classes.root}
      style={style}
    >
      <Grid
        item
        xs={12}
        className={classes.original}
      >
        <MarkdownEditable
          markdown={original}
          raw={raw}
          editable={false}
        />
      </Grid>
      <Grid
        item
        xs={12}
      >
        <MarkdownEditable
          markdown={translation}
          handleChange={handleChange}
          raw={raw}
        />
      </Grid>
    </Grid>
  );
};

MarkdownTranslatable.propTypes = {
  /** Original markdown for the editor. */
  original: PropTypes.string.isRequired,
  /** Translation markdown for the editor. */
  translation: PropTypes.string.isRequired,
  /** Function to propogate changes to the translation. */
  handleChange: PropTypes.func.isRequired,
  /** Replace strings before rendering. */
  inputFilters: PropTypes.array,
  /** Replace strings after editing. */
  outputFilters: PropTypes.array,
  /** CSS for the component. */
  style: PropTypes.object,
  /** Display Raw Markdown or HTML. */
  raw: PropTypes.bool,
};

MarkdownTranslatable.defaultProps = {
  original: '',
  translation: '',
  handleChange: () => {},
  inputFilters: [],
  outputFilters: [],
  style: {},
  raw: false,
};

const styles = theme => ({
  root: {
    lineHeight: '1.1em',
  },
  original: {
    background: '#eee4',
  },
});

export default withStyles(styles)(MarkdownTranslatable);
