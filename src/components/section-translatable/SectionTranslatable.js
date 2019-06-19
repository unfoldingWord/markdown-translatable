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
  Button,
} from '@material-ui/core';
import {
  ExpandMore,
} from '@material-ui/icons';

import BlockTranslatable from '../block-translatable';

import * as helpers from './helpers';
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

  const onExpanded = (_expanded) => {
    if (onSectionFocus) onSectionFocus(_expanded);
    else setExpanded(expanded);
  };

  const setTranslationBlock = ({index, translationBlock}) => {
    let _translationBlocks = [...translationBlocks];
    _translationBlocks[index] = translationBlock;
    setTranslationBlocks(_translationBlocks);
    const _translation = helpers.markdownFromBlocks({blocks: _translationBlocks});
    onTranslation(_translation);
  };

  const blockTranslatables = originalBlocks.map((originalBlock, index) =>
    <BlockTranslatable
      key={index + md5(JSON.stringify(originalBlock)) + Math.random()}
      original={originalBlock}
      translation={translationBlocks[index]}
      inputFilters={inputFilters}
      outputFilters={outputFilters}
      onTranslation={(translationBlock) =>
        setTranslationBlock({index, translationBlock})
      }
      raw={raw}
    />
  );

  return (
    <ExpansionPanel
      style={style}
      className={classes.root}
      defaultExpanded={expanded}
      onChange={onExpanded}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        classes={{content: 'summaryContent'}}
        className={classes.content}
        onClick={() => setExpanded(!expanded)}
        children={
          (expanded) ? <></> :
          <ReactMarkdown
            source={originalBlocks[0]}
            escapeHtml={false}
          />
        }
      />
      <ExpansionPanelDetails
        className={classes.details}
      >
        {blockTranslatables}
      </ExpansionPanelDetails>
      <ExpansionPanelActions>
        <Button
          size="small"
          onClick={() => setRaw(!raw)}
        >
          {raw ? 'Markdown' : 'HTML'}
        </Button>
        <Button size="small" color="primary">
          Save
        </Button>
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
  onSectionFocus: PropTypes.func.isRequired,
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
  onTranslation: () => {},
  onSectionFocus: () => {},
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
});

export default withStyles(styles)(SectionTranslatable);
