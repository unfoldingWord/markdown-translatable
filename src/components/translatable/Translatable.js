import React, {
  useState, useEffect, useCallback, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import {
  DocumentTranslatable,
  SectionTranslatable,
  Actions,
} from '../';
import Headroom from 'react-headroom';

import { MarkdownContext } from '../Markdown.context'

const useStyles = makeStyles(theme => ({ root: {} }));


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

  const component = useMemo(() => {
    const props = {
      original, translation: editedTranslation, onTranslation: setEditedTranslation,
      preview, onPreview: setPreview, inputFilters, outputFilters, blockable,
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
  ]);

  const changed = useMemo(() => (
    (editedTranslation !== translation) || (markdownState.isChanged)
  ), [editedTranslation, translation, markdownState.isChanged]);

  const onHeadroomPin = () =>
  {
    const el = document.getElementById("markdownTranslatableHeaderHeadroom");
    if (el)
    {
      el.style.top = '64px';
    }
  }

  const onHeadroomUnfix = () =>
  {
    const el = document.getElementById("markdownTranslatableHeaderHeadroom");
    if (el)
    {
      el.style.top = '0px';
    }
  }

  const onHeadroomUnpin = () =>
  {
    const el = document.getElementById("markdownTranslatableHeaderHeadroom");
    if (el)
    {
      el.style.top = '0px';
      el.style.transform = 'translate(-100%)';
    }
  }

  return (
      <div className={classes.root}>
        <Headroom id="markdownTranslatableHeaderHeadroom" pinStart={48}
          onPin={()=>{onHeadroomPin();}} onUnfix={()=>{onHeadroomUnfix();}} onUnpin={()=>{onHeadroomUnpin();}}
        >
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
