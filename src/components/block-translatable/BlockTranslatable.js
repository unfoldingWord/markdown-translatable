import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import BlockEditable from '../block-editable';
const useStyles = makeStyles(theme => ({
  root: {},
  original: { background: '#eee4' },
  translation: {},
}));

function BlockTranslatable({
  original,
  translation,
  onTranslation,
  inputFilters,
  outputFilters,
  style,
  preview,
}) {
  const classes = useStyles();

  return (
    <Grid
      container
      wrap="nowrap"
      spacing={0}
      className={classes.root}
      style={style}
    >
      <Grid item xs={12} className={classes.original}>
        <BlockEditable
          markdown={original}
          inputFilters={inputFilters}
          outputFilters={outputFilters}
          preview={preview}
          editable={false}
        />
      </Grid>
      <Grid item xs={12} className={classes.translation}>
        <BlockEditable
          markdown={translation}
          onEdit={onTranslation}
          inputFilters={inputFilters}
          outputFilters={outputFilters}
          preview={preview}
          editable={true}
        />
      </Grid>
    </Grid>
  );
};

BlockTranslatable.propTypes = {
  /** Original markdown for the editor. */
  original: PropTypes.string.isRequired,
  /** Translation markdown for the editor. */
  translation: PropTypes.string.isRequired,
  /** Function to propogate changes to the translation. */
  onTranslation: PropTypes.func.isRequired,
  /** Replace strings before rendering. */
  inputFilters: PropTypes.array,
  /** Replace strings after editing. */
  outputFilters: PropTypes.array,
  /** CSS for the component. */
  style: PropTypes.object,
  /** Display Raw Markdown or HTML. */
  preview: PropTypes.bool,
};

BlockTranslatable.defaultProps = {
  original: '',
  translation: '',
  inputFilters: [],
  outputFilters: [],
  style: {},
  preview: true,
};

export default BlockTranslatable;
