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
  handleChange,
}) {
  const [raw, setRaw] = useState(false);
  const originalBlocks = helpers.blocksFromMarkdown({markdown: original});
  const __translationBlocks = helpers.blocksFromMarkdown({markdown: translation});
  const [translationBlocks, setTranslationBlocks] = useState(__translationBlocks);

  const setTranslationBlock = ({index, translationBlock}) => {
    let _translationBlocks = [...translationBlocks];
    _translationBlocks[index] = translationBlock;
    setTranslationBlocks(_translationBlocks);
    const _translation = helpers.markdownFromBlocks({blocks: _translationBlocks});
    handleChange(_translation);
  };

  const blockRows = originalBlocks.map((originalBlock, index) =>
    <BlockTranslatable
      key={index + md5(JSON.stringify(originalBlock)) + Math.random()}
      original={originalBlock}
      translation={translationBlocks[index]}
      inputFilters={inputFilters}
      outputFilters={outputFilters}
      handleChange={(translationBlock) =>
        setTranslationBlock({index, translationBlock})
      }
      raw={raw}
    />
  );

  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        classes={{content: 'summaryContent'}}
        content={classes.content}
      >
        <ReactMarkdown
          source={originalBlocks[0]}
          escapeHtml={false}
        />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        className={classes.details}
      >
        {blockRows}
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
  handleChange: PropTypes.func.isRequired,
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

export default withStyles(styles)(SectionTranslatable);
