import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
} from '@material-ui/core';
import BlockEditable from '../block-editable';

// const whyDidYouRender = (process.env.NODE_ENV !== 'production') ?
//   require('@welldone-software/why-did-you-render') : undefined;
// if (whyDidYouRender) whyDidYouRender(React);
/**
 * ### A reusable component for translating Markdown as HTML.
 * @component
 */
function BlockTranslatable({
  classes,
  original,
  translation,
  onTranslation,
  inputFilters,
  outputFilters,
  style,
  preview,
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
        <BlockEditable
          markdown={original}
          inputFilters={inputFilters}
          outputFilters={outputFilters}
          preview={preview}
          editable={false}
        />
      </Grid>
      <Grid
        item
        xs={12}
        className={classes.translation}
      >
        <BlockEditable
          markdown={translation}
          inputFilters={inputFilters}
          outputFilters={outputFilters}
          onEdit={onTranslation}
          preview={preview}
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
  onTranslation: () => {},
  inputFilters: [],
  outputFilters: [],
  style: {},
  preview: true,
};

const styles = theme => ({
  root: {
  },
  original: {
    background: '#eee4',
  },
  translation: {
  },
});

const areEqual = (prevProps, nextProps) => {
  const keys = ['original', 'translation', 'preview', 'style'];
  const checks = keys.map(key => (JSON.stringify(prevProps[key]) === JSON.stringify(nextProps[key])));
  const equal = !checks.includes(false);
  // console.log('BlockTranslatable', keys, checks, equal);
  return equal;
};

// BlockTranslatable.whyDidYouRender = true;
const StyleComponent = withStyles(styles)(BlockTranslatable);
const MemoComponent = React.memo(StyleComponent, areEqual);
export default MemoComponent;
