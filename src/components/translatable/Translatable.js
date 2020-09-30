import React, {
  useState, useEffect, useCallback, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import {
  DocumentTranslatable,
  SectionTranslatable,
  Actions,
} from '../';

const useStyles = makeStyles(theme => ({ root: {} }));


function Translatable({
  original,
  translation,
  inputFilters: _inputFilters,
  outputFilters: _outputFilters,
  onTranslation,
}) {
  const { current:inputFilters } = useRef(_inputFilters);
  const { current:outputFilters } = useRef(_outputFilters);
  const classes = useStyles();
  const [preview, setPreview] = useState(true);
  const [sectionable, setSectionable] = useState(true);
  const [blockable, setBlockable] = useState(true);
  const [editedTranslation, setEditedTranslation] = useState(translation);

  useEffect(() => {
    setEditedTranslation(translation);
  }, [translation]);

  const saveTranslation = useCallback(() => {
    onTranslation(editedTranslation);
  }, [onTranslation, editedTranslation]);

  const changed = useMemo(() => (
    editedTranslation !== translation
  ), [editedTranslation, translation]);

  const props = {
    original, translation: editedTranslation, onTranslation: setEditedTranslation,
    preview, onPreview: setPreview, inputFilters, outputFilters, blockable,
  };
  return (
    <div className={classes.root}>
      <Paper>
        <Actions
          sectionable={sectionable}
          onSectionable={setSectionable}
          blockable={blockable}
          onBlockable={setBlockable}
          preview={preview}
          onPreview={setPreview}
          changed={changed}
          onSave={saveTranslation}
        />
      </Paper>
      {
        sectionable ? (<DocumentTranslatable {...props} />) : (<SectionTranslatable {...props} />)
      }
    </div>
  );
};

Translatable.propTypes = {
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
};

Translatable.defaultProps = {
  inputFilters: [],
  outputFilters: [],
};

export default Translatable;
