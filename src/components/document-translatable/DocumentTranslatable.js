import React, { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import md5 from 'md5';

import SectionTranslatable from '../section-translatable';

import {
  sectionsFromMarkdown,
  markdownFromSections,
} from '../../core/';

import { itemsReducer } from '../../core/itemsReducer';

function DocumentTranslatable({
  original,
  translation,
  preview,
  inputFilters,
  outputFilters,
  onTranslation,
  style,
}) {
  const classes = useStyles();
  const [sectionFocus, setSectionFocus] = useState(0);
  const [editedTranslation, setEditedTranslation] = useState(translation);

  const _translationSections = useMemo(() => (
    sectionsFromMarkdown({ markdown: editedTranslation })
  ), [editedTranslation]);
  const [translationSections, dispatch] = useReducer(itemsReducer, _translationSections);

  const originalSections = useMemo(() => (
    sectionsFromMarkdown({ markdown: original })
  ), [original]);

  useEffect(() => {
    const _translationSections = sectionsFromMarkdown({ markdown: translation });
    dispatch({ type: 'SET_ITEMS', value: { items: _translationSections } });
  }, [translation]);

  useEffect(() => {
    const _translation = markdownFromSections({ sections: translationSections });
    setEditedTranslation(_translation);
  }, [translationSections]);

  const _onTranslation = useCallback(onTranslation, []);
  useEffect(() => {
    _onTranslation(editedTranslation);
    // console.log('DocumentTranslatable got updated editedTranslation')
  }, [editedTranslation, _onTranslation]); // adding onTranslation to memoized array causes infinite loop

  const setTranslationSection = useCallback(({ index, item }) => {
    dispatch({ type: 'SET_ITEM', value: { index, item } });
  }, []);

  const sectionTranslatables = useMemo(() => (
    originalSections.map((originalSection, index) => {
      const key = index + md5(JSON.stringify(originalSection));
      const translationSection = translationSections[index];
      const __onTranslation = (item) => setTranslationSection({ index, item });
      const onExpanded = (expanded) => {
        if (expanded) setSectionFocus(index);
        else setSectionFocus(null);
      };
      const expanded = (sectionFocus === index);
      return (
        <SectionTranslatable
          key={key}
          original={originalSection}
          translation={translationSection}
          inputFilters={inputFilters}
          outputFilters={outputFilters}
          onTranslation={__onTranslation}
          onExpanded={onExpanded}
          expanded={expanded}
          preview={preview}
          style={style}
        />
      );
    })
  ), [inputFilters, originalSections, outputFilters, preview, sectionFocus, setTranslationSection, style, translationSections]);

  return (
    <div className={classes.root}>
      {sectionTranslatables}
    </div>
  );
};

DocumentTranslatable.propTypes = {
  /** Original markdown for the editor. */
  original: PropTypes.string.isRequired,
  /** Translation markdown for the editor. */
  translation: PropTypes.string.isRequired,
  /** Preview HTML rendered vs Raw Markdown */
  preview: PropTypes.bool,
  /** Callback to set preview */
  onPreview: PropTypes.func,
  /** Function to propogate changes to the translation. */
  onTranslation: PropTypes.func.isRequired,
  /** Replace strings before rendering. */
  inputFilters: PropTypes.array,
  /** Replace strings after editing. */
  outputFilters: PropTypes.array,
  /** CSS for the component. */
  style: PropTypes.object,
};

DocumentTranslatable.defaultProps = {
  inputFilters: [],
  outputFilters: [],
}

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: `${theme.spacing(2)}px`,
  },
}));

export default DocumentTranslatable;
