import React, {
  useState, useEffect, useCallback, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Headroom from 'react-headroom';

import {
  DocumentTranslatable,
  SectionTranslatable,
  Actions,
} from '../';

import { MarkdownContext } from '../Markdown.context'

const useStyles = makeStyles(theme => ({ root: {} }));


function Translatable({
  original,
  translation,
  inputFilters,
  outputFilters,
  onTranslation,
  doPinToolbar = true,
  onContentIsDirty,
  translationFontFamily,
  originalFontFamily,
}) {
  const classes = useStyles();
  const [preview, setPreview] = useState(false);
  const [sectionable, setSectionable] = useState(true);
  const [blockable, setBlockable] = useState(true);
  const [editedTranslation, setEditedTranslation] = useState(translation);

  const { state: markdownState, actions: markdownActions } = useContext(MarkdownContext);

  useEffect(() => {
    setEditedTranslation(translation);
  }, [translation]);

  const saveTranslation = useCallback(() => {
    onTranslation(editedTranslation);
    if (markdownActions && markdownActions.setIsChanged) {
      markdownActions.setIsChanged(false);
    }
  }, [onTranslation, editedTranslation, markdownActions.setIsChanged]);

  // Push "isChanged," so app knows when SAVE button is enabled.
  // See also Translatable in markdown-translatable.
  useEffect(() => {
    if (onContentIsDirty) {
      onContentIsDirty(markdownState.isChanged);
    }
  }, [markdownState.isChanged, onContentIsDirty]);

  const component = useMemo(() => {
    console.log('rcl ont', translationFontFamily);
    const props = {
      original, translation: editedTranslation, onTranslation: setEditedTranslation,
      preview, onPreview: setPreview, inputFilters, outputFilters, blockable,
      translationFontFamily, originalFontFamily,
    };
    let _component;

    if (sectionable) {
      _component = <DocumentTranslatable {...props} />;
    } else {
      const _props = {
        ...props, expanded: true, onExpanded: () => { },
      };
      _component = <SectionTranslatable {..._props} />;
    }
    return _component;
  }, [
    original, editedTranslation, setEditedTranslation, inputFilters,
    outputFilters, sectionable, blockable, preview,
    translationFontFamily, originalFontFamily,
  ]);

  const changed = useMemo(() => (
    (editedTranslation !== translation) || (markdownState.isChanged)
  ), [editedTranslation, translation, markdownState.isChanged]);

  return (
    <div className={classes.root}>
      <Headroom pinStart={48} role='toolbar' disable={!doPinToolbar}>
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
      </Headroom>
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
};

Translatable.defaultProps = {
  inputFilters: [],
  outputFilters: [],
};

export default Translatable;
