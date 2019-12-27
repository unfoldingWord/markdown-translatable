import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import md5 from 'md5';

import SectionTranslatable from '../section-translatable';

import * as helpers from '../../core/';

// const whyDidYouRender = (process.env.NODE_ENV !== 'production') ?
//   require('@welldone-software/why-did-you-render') : undefined;
// if (whyDidYouRender) whyDidYouRender(React);
/**
 * ### A reusable component for translating a Markdown document.
 * @component
 */
function DocumentTranslatable({
  original,
  translation,
  inputFilters,
  outputFilters,
  onTranslation,
  style,
}) {
  const classes = useStyles();
  const [sectionFocus, setSectionFocus] = useState(0);
  const originalSections = helpers.sectionsFromMarkdown({ markdown: original });
  const [translationSections, setTranslationSections] = useState([]);

  useEffect(() => {
    const __translationSections = helpers.sectionsFromMarkdown({ markdown: translation });
    setTranslationSections(__translationSections);
  }, [translation]);

  const setTranslationSection = ({ index, translationSection }) => {
    setSectionFocus(index);
    let _translationSections = [...translationSections];
    _translationSections[index] = translationSection;
    setTranslationSections(_translationSections);
    const _translation = helpers.markdownFromSections({ sections: _translationSections });
    onTranslation(_translation);
  };

  const sectionTranslatables = originalSections.map((originalSection, index) => {
    const key = index + md5(JSON.stringify(originalSection));
    const translationSection = translationSections[index];
    const _onTranslation = (_translationSection) =>
      setTranslationSection({ index, translationSection: _translationSection });
    const _onSectionFocus = (expanded) => {
      if (expanded) setSectionFocus(index);
      else setSectionFocus(null);
    };
    const _sectionFocus = (sectionFocus === index)
    return (
      <SectionTranslatable
        key={key}
        original={originalSection}
        translation={translationSection}
        inputFilters={inputFilters}
        outputFilters={outputFilters}
        onTranslation={_onTranslation}
        onSectionFocus={_onSectionFocus}
        sectionFocus={_sectionFocus}
        style={style}
      />
    );
  });

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
  original: '',
  translation: '',
  onTranslation: () => { },
  inputFilters: [],
  outputFilters: [],
  style: {},
}

const useStyles = makeStyles(theme => ({
  root: {
  },
}));

const areEqual = (prevProps, nextProps) => {
  const keys = ['original', 'translation', 'style'];
  const checks = keys.map(key => (JSON.stringify(prevProps[key]) === JSON.stringify(nextProps[key])));
  const equal = !checks.includes(false);
  // console.log('DocumentTranslatable', keys, checks, equal);
  return equal;
};

// DocumentTranslatable.whyDidYouRender = true;
const MemoComponent = React.memo(DocumentTranslatable, areEqual);
export default MemoComponent;
