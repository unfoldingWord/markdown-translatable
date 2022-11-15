import React, {useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {Grid} from '@material-ui/core';
import BlockEditable from '../block-editable';

function BlockTranslatable({
  original,
  translation,
  onTranslation,
  inputFilters,
  outputFilters,
  style,
  preview,
  originalFontFamily,
  translationFontFamily,
}) {
  const classes = useStyles({ originalFontFamily, translationFontFamily });

  const originalBlock = useMemo(() => (
    <BlockEditable
      markdown={original}
      inputFilters={inputFilters}
      outputFilters={outputFilters}
      preview={preview}
      editable={false}
    />
  ), [original, inputFilters, outputFilters, preview]);

  const translationBlock = useMemo(() => (
    <BlockEditable
      markdown={translation}
      onEdit={onTranslation}
      inputFilters={inputFilters}
      outputFilters={outputFilters}
      preview={preview}
      editable={true}
    />
  ), [translation, onTranslation, inputFilters, outputFilters, preview]);

  return (
    <Grid
      container
      wrap="nowrap"
      spacing={0}
      className={classes.root}
      style={style}
    >
      <Grid item xs={12} className={classes.original}>
        {originalBlock}
      </Grid>
      <Grid item xs={12} className={classes.translation}>
        {translationBlock}
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
  /** CSS attribute for custom font */
  translationFontFamily: PropTypes.string,
  /** CSS attribute for custom font */
  originalFontFamily: PropTypes.string,
};

BlockTranslatable.defaultProps = {
  original: '',
  translation: '',
  inputFilters: [],
  outputFilters: [],
  style: {},
  preview: true,
};

const useStyles = makeStyles(theme => ({
  root: {
  },
  original: props => ({
    background: '#eee4',
    fontFamily: props.originalFontFamily || 'inherit',
  }),
  translation: props => ({
    fontFamily: props.translationFontFamily || 'inherit',
  }),
}));

export default BlockTranslatable;
