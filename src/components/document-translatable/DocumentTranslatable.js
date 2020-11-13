import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import md5 from 'md5';
import SectionTranslatable from '../section-translatable';
import {
  sectionsFromMarkdown,
  markdownFromSections,
} from '../../core/';

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
  const [translationSections, setTranslationSections] = useState(null);
  const [originalSections, setOriginalSections] = useState(null);
  const classes = useStyles();
  const [sectionFocus, setSectionFocus] = useState(0);

  useEffect(() => {
    const _originalSections = sectionsFromMarkdown({ markdown: original });
    setOriginalSections(_originalSections);
  }, [original]);

  useEffect(() => {
    const _translationSections = sectionsFromMarkdown({ markdown: translation });
    setTranslationSections(_translationSections);
  }, [translation]);

  useEffect(() => {
    if (translationSections) {
      const _translation = markdownFromSections({ sections: translationSections });

      if (_translation !== translation) {
        onTranslation(_translation);
      }
    }
  }, [onTranslation, translation, translationSections]);


  const totalSections = originalSections?.length > translationSections?.length ?
    originalSections?.length : translationSections?.length;

  const sectionsTranslatables = [];

  for (let i = 0; i < totalSections; i++) {
    const originalSection = originalSections && originalSections[i];
    const translationSection = translationSections && translationSections[i];
    const key = md5(JSON.stringify(originalSection + i.toString()));

    const _onTranslation = (item) => {
      const temp = [...translationSections];
      temp[i] = item;
      setTranslationSections(temp);
    };

    const onExpanded = (expanded) => {
      if (expanded) {
        setSectionFocus(i);
      } else {
        setSectionFocus(null);
      }
    };

    const expanded = (sectionFocus === i);

    sectionsTranslatables.push(
      <SectionTranslatable
        key={key}
        original={originalSection}
        translation={translationSection}
        inputFilters={inputFilters}
        outputFilters={outputFilters}
        onTranslation={_onTranslation}
        onExpanded={onExpanded}
        expanded={expanded}
        preview={preview}
        blockable={blockable}
        style={style}
      />
    );
  };

  return (
    <div className={classes.root}>
      {sectionsTranslatables}
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
