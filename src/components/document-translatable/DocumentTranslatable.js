import React, {
  useState, useEffect, useMemo, useCallback, useReducer,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import md5 from 'md5';

import SectionTranslatable from '../section-translatable';

import {
  sectionsFromMarkdown,
  markdownFromSections,
} from '../../core/';

import { itemsReducer } from '../../core/itemsReducer';
const useStyles = makeStyles(theme => ({ root: { marginTop: `${theme.spacing(2)}px` } }));

function DocumentTranslatable({
  original,
  translation,
  preview,
  inputFilters,
  outputFilters,
  onTranslation,
  blockable,
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

  useEffect(() => {
    if (editedTranslation !== translation) {
      onTranslation(editedTranslation);
      //console.log('DocumentTranslatable got updated editedTranslation');
    }
  }, [editedTranslation, onTranslation, translation]); // adding onTranslation to memoized array causes infinite loop

  const setTranslationSection = useCallback(({ index, item }) => {
    dispatch({ type: 'SET_ITEM', value: { index, item } });
  }, []);



  const sectionTranslatables = () => {
    const totalSections = originalSections.length > translationSections.length ?
      originalSections.length : translationSections.length;

    const _sectionsTranslatables = [];

    for ( let i=0; i < totalSections; i++ ) {
      const originalSection = originalSections[i];
      const translationSection = translationSections[i];
      const key = md5(i + JSON.stringify(originalSection) + JSON.stringify(translationSection));
      const __onTranslation = (item) => setTranslationSection({ index: i, item });

      const onExpanded = (expanded) => {
        if (expanded) {
          setSectionFocus(i);
        } else {
          setSectionFocus(null);
        }
      };

      const expanded = (sectionFocus === i);

      _sectionsTranslatables.push (
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
          blockable={blockable}
          style={style}
        />
      );
    };
    return _sectionsTranslatables;
  };


  return (
    <div className={classes.root}>
      {sectionTranslatables()}
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
  /** Divide segments by blocks */
  blockable: PropTypes.bool,
  /** Replace strings before rendering. */
  inputFilters: PropTypes.array,
  /** Replace strings after editing. */
  outputFilters: PropTypes.array,
  /** CSS for the component. */
  style: PropTypes.object,
};

DocumentTranslatable.defaultProps = {
  blockable: true,
  inputFilters: [],
  outputFilters: [],
};

export default DocumentTranslatable;
