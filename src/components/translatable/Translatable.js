import React, {useState, useEffect, useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {Paper} from '@material-ui/core';
import {
  DocumentTranslatable,
  SectionTranslatable,
  Actions,
} from '../';

function Translatable({
  original,
  translation,
  inputFilters,
  outputFilters,
  onTranslation,
}) {
  const classes = useStyles();
  const [preview, setPreview] = useState(true);
  const [sectionable, setSectionable] = useState(true);
  const [editedTranslation, setEditedTranslation] = useState(translation);

  useEffect(() => {
    setEditedTranslation(translation);
  }, [translation]);
  
  const saveTranslation = useCallback(() => {
    onTranslation(editedTranslation);
  }, [onTranslation, editedTranslation]);
  
  const component = useMemo(() => {
    const props = {
      original, translation: editedTranslation, onTranslation: setEditedTranslation, 
      preview, onPreview: setPreview, inputFilters, outputFilters,
    };
    let _component;
    if (sectionable) _component = <DocumentTranslatable {...props} />
    else _component = <SectionTranslatable expanded={true} onExpanded={()=>{}} {...props} />;
    return _component;
  }, [original, editedTranslation, setEditedTranslation, inputFilters, outputFilters, sectionable, preview]);
  
  const changed = useMemo(() => (
    editedTranslation !== translation
  ), [editedTranslation, translation]);

  return (
    <div className={classes.root}>
      <Paper>
        <Actions
          sectionable={sectionable}
          onSectionable={setSectionable}
          preview={preview}
          onPreview={setPreview}
          changed={changed}
          onSave={saveTranslation}
        />
      </Paper>
      {component}
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
  /** Divide editor by segments */
  sectionable: PropTypes.bool,
};

Translatable.defaultProps = {
  inputFilters: [],
  outputFilters: [],
}

const useStyles = makeStyles(theme => ({
  root: {},
}));

export default Translatable;
