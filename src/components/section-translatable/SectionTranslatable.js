import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import md5 from 'md5';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  IconButton,
} from '@material-ui/core';
import {
  ExpandMore,
  ExpandLess,
  Save,
  SaveOutlined,
  Pageview,
  PageviewOutlined,
} from '@material-ui/icons';

import BlockTranslatable from '../block-translatable';

import * as helpers from './helpers';

// const whyDidYouRender = (process.env.NODE_ENV !== 'production') ?
//   require('@welldone-software/why-did-you-render') : undefined;
// if (whyDidYouRender) whyDidYouRender(React);
/**
 * ### A reusable component for translating Markdown in sections.
 * @component
 */
function SectionTranslatable({
  classes,
  original,
  translation,
  inputFilters,
  outputFilters,
  onTranslation,
  onSectionFocus,
  sectionFocus,
  style,
}) {
  const [raw, setRaw] = useState(false);
  const [expanded, setExpanded] = useState(sectionFocus);
  const originalBlocks = helpers.blocksFromMarkdown({markdown: original});
  const __translationBlocks = helpers.blocksFromMarkdown({markdown: translation});
  const [translationBlocks, setTranslationBlocks] = useState(__translationBlocks);
  const [editedTranslation, setEditedTranslation] = useState();

  const saveEditedTranslation = () => onTranslation(editedTranslation);
  const toggleRaw = () => setRaw(!raw);

  if (onSectionFocus && (sectionFocus !== expanded)) setExpanded(sectionFocus);

  const expandedToggle = () => {
    const _expanded = !expanded;
    if (onSectionFocus) onSectionFocus(_expanded);
    setExpanded(_expanded);
  };

  const setTranslationBlock = ({index, translationBlock}) => {
    let _translationBlocks = [...translationBlocks];
    _translationBlocks[index] = translationBlock;
    setTranslationBlocks(_translationBlocks);
    const _translation = helpers.markdownFromBlocks({blocks: _translationBlocks});
    setEditedTranslation(_translation);
  };

  const blockTranslatables = originalBlocks.map((originalBlock, index) => {
    const key = index + md5(JSON.stringify(originalBlock));
    const _onTranslation = (translationBlock) => setTranslationBlock({index, translationBlock});
    const translationBlock = translationBlocks[index];
    return (
      <BlockTranslatable
        key={key}
        original={originalBlock}
        translation={translationBlock}
        inputFilters={inputFilters}
        outputFilters={outputFilters}
        onTranslation={_onTranslation}
        raw={raw}
      />
    );
  });

  const titleBlock = originalBlocks[0];
  const summaryTitle = (expanded) ? <></> : (
    <ReactMarkdown
      source={titleBlock}
      escapeHtml={false}
    />
  );

  const changed = (editedTranslation && translation !== editedTranslation);
  const saveIcon = changed ? <Save /> : <SaveOutlined />;
  const rawIcon = raw ? <PageviewOutlined /> : <Pageview />;

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
        <IconButton onClick={toggleRaw}>
          {rawIcon}
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
  actions: {
    padding: '8px',
  },
});

const areEqual = (prevProps, nextProps) => {
  const keys = ['original', 'translation', 'sectionFocus', 'style'];
  const checks = keys.map(key => (JSON.stringify(prevProps[key]) === JSON.stringify(nextProps[key])));
  const equal = !checks.includes(false);
  // console.log('SectionTranslatable', keys, checks, equal);
  return equal;
};

// SectionTranslatable.whyDidYouRender = true;
const StyleComponent = withStyles(styles)(SectionTranslatable);
const MemoComponent = React.memo(StyleComponent, areEqual);
export default MemoComponent;
