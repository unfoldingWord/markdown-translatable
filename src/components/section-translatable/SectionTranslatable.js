import React, {
  useState, useEffect, useReducer, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import md5 from 'md5';
import {
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, ExpansionPanelActions, IconButton,
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
  style,
}) {
  const classes = useStyles();
  const [editedTranslation, setEditedTranslation] = useState(translation);

  const originalBlocks = useMemo(() => (
    blocksFromMarkdown({ markdown: original })
  ), [original]);

  const _translationBlocks = useMemo(() => (
    blocksFromMarkdown({ markdown: translation })
  ), [translation]);
  const [translationBlocks, dispatch] = useReducer(itemsReducer, _translationBlocks);

  const _onTranslation = useCallback(onTranslation, []);
  const _onExpanded = useCallback(onExpanded, []);

  // update translationBlocks when translation is updated
  useEffect(() => {
    const _translationBlocks = blocksFromMarkdown({ markdown: translation });
    dispatch({ type: 'SET_ITEMS', value: { items: _translationBlocks } });
    // console.log('SectionTranslatable got updated translation')
  }, [translation]);
  // update onTranslation when translationBlocks are updated
  useEffect(() => {
    const _translation = markdownFromBlocks({ blocks: translationBlocks });
    setEditedTranslation(_translation);
  }, [translationBlocks]);

  useEffect(() => {
    _onTranslation(editedTranslation);
    // console.log('SectionTranslatable got updated editedTranslation')
  }, [editedTranslation, _onTranslation]);

  const expandedToggle = useCallback(() => {
    _onExpanded(!expanded);
  }, [_onExpanded, expanded]);

  const setTranslationBlock = useCallback(({ index, item }) => {
    dispatch({ type: 'SET_ITEM', value: { index, item } });
  }, []);

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
          inputFiltesrs={inputFilters}
          outputFilters={outputFilters}
          onTranslation={_onTranslation}
          preview={preview}
        />
      );
    })
  ), [originalBlocks, translationBlocks, inputFilters, outputFilters, preview, setTranslationBlock]);

  const titleBlock = useMemo(() => (
    originalBlocks[0]
  ), [originalBlocks]);
  const summaryTitle = useMemo(() => (
    (expanded) ? <></> : <ReactMarkdown source={titleBlock} escapeHtml={false} />
  ), [expanded, titleBlock]);

  const component = useMemo(() => (
    <ExpansionPanel style={style} className={classes.root} expanded={expanded}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        // classes={{content: 'summaryContent'}}
        className={classes.content}
        onClick={expandedToggle}>
        {summaryTitle}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        {blockTranslatables}
      </ExpansionPanelDetails>
      <ExpansionPanelActions className={classes.actions}>
        <IconButton onClick={expandedToggle}>
          <ExpandLess />
        </IconButton>
      </ExpansionPanelActions>
    </ExpansionPanel>
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
  /** Replace strings before rendering. */
  inputFilters: PropTypes.array,
  /** Replace strings after editing. */
  outputFilters: PropTypes.array,
  /** CSS for the component. */
  style: PropTypes.object,
};

SectionTranslatable.defaultProps = {
  original: '',
  translation: '',
  inputFilters: [],
  outputFilters: [],
  style: {},
};

export default SectionTranslatable;
