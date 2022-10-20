import React, {
  useState, useEffect, useReducer, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import md5 from 'md5';
import {
  Accordion, AccordionSummary, AccordionDetails, AccordionActions, IconButton,
} from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';

import BlockTranslatable from '../block-translatable';

import {
  blocksFromMarkdown, markdownFromBlocks, itemsReducer,
} from '../../core/';
import { useStyles } from './styles';

function SectionTranslatable({
  original,
  translation,
  preview,
  inputFilters,
  outputFilters,
  onTranslation,
  onExpanded,
  expanded,
  blockable,
  style,
  translationFontFamily,
  originalFontFamily,
}) {
  const classes = useStyles();
  const [editedTranslation, setEditedTranslation] = useState(translation);

  const originalBlocks = useMemo(() => (
    (blockable) ? blocksFromMarkdown({ markdown: original }) : [original]
  ), [blockable, original]);

  const _translationBlocks = useMemo(() => (
    (blockable) ? blocksFromMarkdown({ markdown: translation }) : [translation]
  ), [blockable, translation]);
  const [translationBlocks, dispatch] = useReducer(itemsReducer, _translationBlocks);

  const _onExpanded = useCallback(onExpanded, []);

  // update translationBlocks to match blockable chained through _translationBlocks
  useEffect(() => {
    dispatch({ type: 'SET_ITEMS', value: { items: _translationBlocks } });
  }, [_translationBlocks]);
  // update onTranslation when translationBlocks are updated
  useEffect(() => {
    const _translation = markdownFromBlocks({ blocks: translationBlocks });
    setEditedTranslation(_translation);
  }, [translationBlocks]);

  useEffect(() => {
    if (editedTranslation !== translation) {
      onTranslation(editedTranslation);
      // console.log('SectionTranslatable got updated editedTranslation');
    }
  }, [editedTranslation, onTranslation, translation]);

  const expandedToggle = useCallback(() => {
    _onExpanded(!expanded);
  }, [_onExpanded, expanded]);

  const setTranslationBlock = useCallback(({ index, item }) => {
    dispatch({ type: 'SET_ITEM', value: { index, item } });
  }, []);

  const blockTranslatables = useCallback(() => {
    const mostBlocks = originalBlocks.length > translationBlocks.length ?
      originalBlocks : translationBlocks;

    const _blocksTranslatables = [];

    for ( let i=0; i < mostBlocks.length; i++ ) {
      const _onTranslation = (item) => setTranslationBlock({ index: i, item });
      const translationBlock = translationBlocks[i];
      const originalBlock = originalBlocks[i];
      const key = i + md5(JSON.stringify(originalBlock + translationBlock));

      _blocksTranslatables.push(
        <BlockTranslatable
          key={key}
          original={originalBlock}
          translation={translationBlock}
          inputFilters={inputFilters}
          outputFilters={outputFilters}
          onTranslation={_onTranslation}
          preview={preview}
          originalFontFamily={originalFontFamily}
          translationFontFamily={translationFontFamily}
        />
      );
    };
    return _blocksTranslatables;
  }, [inputFilters, originalBlocks, outputFilters, preview, setTranslationBlock, translationBlocks]);

  const titleBlock = originalBlocks[0].split('\n\n')[0] || translationBlocks[0].split('\n\n')[0];

  const summaryTitle = useMemo(() => (
    (expanded) ? <></> : <ReactMarkdown source={titleBlock} escapeHtml={false} />
  ), [expanded, titleBlock]);

  const component = useMemo(() => (
    <Accordion style={style} className={classes.root} expanded={expanded}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        // classes={{content: 'summaryContent'}}
        className={classes.content}
        onClick={expandedToggle}>
        {summaryTitle}
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        {blockTranslatables()}
      </AccordionDetails>
      <AccordionActions className={classes.actions}>
        <IconButton onClick={expandedToggle}>
          <ExpandLess />
        </IconButton>
      </AccordionActions>
    </Accordion>
  ), [blockTranslatables, classes, expanded, expandedToggle, style, summaryTitle]);

  return (
    <>
      {component}
    </>
  );
};

SectionTranslatable.propTypes = {
  /** Original markdown for the editor. */
  original: PropTypes.string.isRequired,
  /** Translation markdown for the editor. */
  translation: PropTypes.string.isRequired,
  /** Function to propogate changes to the translation. */
  onTranslation: PropTypes.func.isRequired,
  /** Preview HTML rendered vs Raw Markdown */
  preview: PropTypes.bool,
  /** Function to propogate changes to the Section in focus. */
  onExpanded: PropTypes.func,
  /** Set the Section in focus. */
  expanded: PropTypes.bool,
  /** Divide segments by blocks */
  blockable: PropTypes.bool,
  /** Replace strings before rendering. */
  inputFilters: PropTypes.array,
  /** Replace strings after editing. */
  outputFilters: PropTypes.array,
  /** CSS for the component. */
  style: PropTypes.object,
  /** CSS attribute for custom font */
  translationFontFamily: PropTypes.string,
  /** CSS attribute for custom font */
  originalFontFamily: PropTypes.string,
};

SectionTranslatable.defaultProps = {
  original: '',
  translation: '',
  inputFilters: [],
  outputFilters: [],
  blockable: true,
  style: {},
};

export default SectionTranslatable;


/* code graveyard
  const blockTranslatables = useMemo(() => (
    originalBlocks.map((originalBlock, index) => {
      const _onTranslation = (item) => setTranslationBlock({ index, item });
      const translationBlock = translationBlocks[index];
      const key = index + md5(JSON.stringify(originalBlock + translationBlock));
      return (
        <BlockTranslatable
          key={key}
          original={originalBlock}
          translation={translationBlock}
          inputFilters={inputFilters}
          outputFilters={outputFilters}
          onTranslation={_onTranslation}
          preview={preview}
        />
      );
    })
  ), [originalBlocks, translationBlocks, inputFilters, outputFilters, preview, setTranslationBlock]);
*/
