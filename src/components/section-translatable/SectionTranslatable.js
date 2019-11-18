import React, {useState, useEffect, useReducer, useMemo, useCallback} from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import md5 from 'md5';
import {
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, ExpansionPanelActions, IconButton
} from '@material-ui/core';
import {
  ExpandMore, ExpandLess, Save, SaveOutlined, Pageview, PageviewOutlined,
} from '@material-ui/icons';

import BlockTranslatable from '../block-translatable';

import * as helpers from './helpers';
import { blocksReducer } from './blocksReducer';
import { useStyles } from './styles';

/**
 * ### A reusable component for translating Markdown in sections.
 * @component
 */
function SectionTranslatable({
  original,
  translation,
  inputFilters,
  outputFilters,
  onTranslation,
  onSectionFocus,
  sectionFocus,
  style,
}) {
  const classes = useStyles();
  const [preview, setPreview] = useState(true);
  const [expanded, setExpanded] = useState(sectionFocus);
  const [originalBlocks, setOriginalBlocks] = useState([]);
  const [translationBlocks, targetBlocksDispatch] = useReducer(blocksReducer, []);
  const [editedTranslation, setEditedTranslation] = useState();
  // update originalBlocks when original is updated
  useEffect(() => {
    const _originalBlocks = helpers.blocksFromMarkdown({markdown: original});
    setOriginalBlocks(_originalBlocks);
  }, [original]);
  // update translationBlocks when translation is updated
  useEffect(() => {
    const _translationBlocks = helpers.blocksFromMarkdown({markdown: translation});
    targetBlocksDispatch({type: 'SET_BLOCKS', value: {blocks: _translationBlocks}});
  }, [translation]);
  // update editedTranslation when translationBlocks are updated
  useEffect(() => {
    const _translation = helpers.markdownFromBlocks({blocks: translationBlocks});
    setEditedTranslation(_translation);
  }, [translationBlocks]);

  useEffect(() => {
    if (onSectionFocus && (sectionFocus !== expanded)) setExpanded(sectionFocus);
  }, [onSectionFocus, sectionFocus, expanded]);

  const expandedToggle = useCallback(() => {
    if (onSectionFocus) onSectionFocus(!expanded);
    setExpanded(_expanded => !_expanded);
  }, [onSectionFocus, expanded]);

  const setTranslationBlock = useCallback(({index, markdown}) => {
    targetBlocksDispatch({type: 'SET_BLOCK', value: {index, markdown}});
  }, []);

  const saveEditedTranslation = useCallback(() => (
    onTranslation(editedTranslation)
  ), [editedTranslation]);

  const togglePreview = useCallback(() => {setPreview(!preview);}, [preview]);

  const blockTranslatables = useMemo(() => (
    originalBlocks.map((originalBlock, index) => {
      const _onTranslation = (markdown) => setTranslationBlock({index, markdown});
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
  ), [originalBlocks, translationBlocks, inputFilters, outputFilters, preview]);

  const titleBlock = useMemo(() => (originalBlocks[0]), [originalBlocks]);
  const summaryTitle = useMemo(() => (
    (expanded) ? <></> : <ReactMarkdown source={titleBlock} escapeHtml={false} />
  ), [expanded, titleBlock])

  const changed = useMemo(() => (editedTranslation && translation !== editedTranslation), [editedTranslation, translation]);
  const saveIcon = useMemo(() => (changed ? <Save /> : <SaveOutlined />), [changed]);
  const previewIcon = useMemo(() => (!preview ? <Pageview /> : <PageviewOutlined />), [preview]);

  return (
    <ExpansionPanel
      style={style}
      className={classes.root}
      expanded={expanded}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        // classes={{content: 'summaryContent'}}
        className={classes.content}
        onClick={expandedToggle}
        children={summaryTitle}
      />
      <ExpansionPanelDetails
        className={classes.details}
      >
        {blockTranslatables}
      </ExpansionPanelDetails>
      <ExpansionPanelActions className={classes.actions}>
        <IconButton onClick={togglePreview}>
          {previewIcon}
        </IconButton>
        <IconButton disabled={!changed} onClick={saveEditedTranslation}>
          {saveIcon}
        </IconButton>
        <IconButton onClick={expandedToggle}>
          <ExpandLess />
        </IconButton>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

SectionTranslatable.propTypes = {
  /** Original markdown for the editor. */
  original: PropTypes.string.isRequired,
  /** Translation markdown for the editor. */
  translation: PropTypes.string.isRequired,
  /** Function to propogate changes to the translation. */
  onTranslation: PropTypes.func.isRequired,
  /** Function to propogate changes to the Section in focus. */
  onSectionFocus: PropTypes.func,
  /** Set the Section in focus. */
  sectionFocus: PropTypes.bool,
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
  sectionFocus: false,
  style: {},
};

const areEqual = (prevProps, nextProps) => {
  const keys = ['original', 'translation', 'sectionFocus', 'style'];
  const checks = keys.map(key => (JSON.stringify(prevProps[key]) === JSON.stringify(nextProps[key])));
  const equal = !checks.includes(false);
  // console.log('SectionTranslatable', keys, checks, equal);
  return equal;
};

// SectionTranslatable.whyDidYouRender = true;
const MemoComponent = React.memo(SectionTranslatable, areEqual);
export default MemoComponent;
