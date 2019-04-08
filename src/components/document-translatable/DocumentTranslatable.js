import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import md5 from 'md5';
import {
} from '@material-ui/core';
import {
} from '@material-ui/icons';

import SectionTranslatable from '../section-translatable';

import * as helpers from './helpers';
/**
 * ### A reusable component for translating a Markdown document.
 * @component
 */
function DocumentTranslatable({
  classes,
  original,
  translation,
  inputFilters,
  outputFilters,
  handleChange,
  style,
}) {
  const originalSections = helpers.sectionsFromMarkdown({markdown: original});
  const __translationSections = helpers.sectionsFromMarkdown({markdown: translation});
  const [translationSections, setTranslationSections] = useState(__translationSections);

  const setTranslationSection = ({index, translationSection}) => {
    let _translationSections = [...translationSections];
    _translationSections[index] = translationSection;
    setTranslationSections(_translationSections);
    const _translation = helpers.markdownFromSections({sections: _translationSections});
    handleChange(_translation);
  };

  const sectionTranslatables = originalSections.map((originalSection, index) =>
    <SectionTranslatable
      key={index + md5(JSON.stringify(originalSection)) + Math.random()}
      original={originalSection}
      translation={translationSections[index]}
      inputFilters={inputFilters}
      outputFilters={outputFilters}
      handleChange={(translationSection) =>
        setTranslationSection({index, translationSection})
      }
      style={style}
    />
  );

  return (
    <div>
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
  handleChange: PropTypes.func.isRequired,
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
  handleChange: () => {},
  inputFilters: [],
  outputFilters: [],
  style: {},
}

const styles = theme => ({
  root: {
  },
  details: {
    display: 'block',
    padding: '0',
    borderTop: '1px solid #ccc',
    borderBottom: '1px solid #ccc',
  },
});

export default withStyles(styles)(DocumentTranslatable);
