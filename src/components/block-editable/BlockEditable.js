import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import * as helpers from './helpers';

// const whyDidYouRender = (process.env.NODE_ENV !== 'production') ?
//   require('@welldone-software/why-did-you-render') : undefined;
// if (whyDidYouRender) whyDidYouRender(React);
/**
 * ### A reusable component for translating a Markdown block as HTML.
 * @component
 */
function BlockEditable({
  markdown,
  onEdit,
  inputFilters,
  outputFilters,
  style,
  preview,
  editable,
}) {
  const classes = useStyles();
  let component;

  let _style = {...style};
  if (helpers.isHebrew(markdown)) {
    _style.fontSize = '1.5em';
  }

  const handleBlur = (_markdown) => {
    const oldHTML = helpers.markdownToHtml({markdown, inputFilters});
    const newHTML = helpers.markdownToHtml({markdown: _markdown, inputFilters});
    if (oldHTML !== newHTML) onEdit(_markdown);
  }

  const handleHTMLBlur = (e) => {
    const html = e.target.innerHTML;
    const _markdown = helpers.htmlToMarkdown({html, outputFilters});
    handleBlur(_markdown);
  };

  const handleRawBlur = (e) => {
    const string = e.target.innerText//.replace(/&lt;/g, '<').replace(/&amp;/g, '&');
    const _markdown = helpers.filter({
      string,
      filters: outputFilters
    })
    handleBlur(_markdown);
  };

  if (!preview) {
    const code = helpers.filter({string: markdown, filters: inputFilters})//.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const dangerouslySetInnerHTML = { __html: code };
    component = (
      <pre
        className={classes.pre}
      >
        <code
          className={classes.markdown}
          style={_style}
          dir="auto"
          contentEditable={editable}
          onBlur={handleRawBlur}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      </pre>
    );
  } else {
    const dangerouslySetInnerHTML = { __html: helpers.markdownToHtml({markdown, inputFilters}) };
    component = (
      <div
        style={_style}
        className={classes.html}
        dir="auto"
        contentEditable={editable}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        onBlur={handleHTMLBlur}
      />
    );
  }

  return (
    <div
      className={classes.root}
    >
      {component}
    </div>
  );
};

BlockEditable.propTypes = {
  /** Initial markdown for the editor. */
  markdown: PropTypes.string.isRequired,
  /** Function to propogate changes to the markdown. */
  onEdit: PropTypes.func.isRequired,
  /** Replace strings before rendering. */
  inputFilters: PropTypes.array,
  /** Replace strings after editing. */
  outputFilters: PropTypes.array,
  /** CSS for the component. */
  style: PropTypes.object,
  /** Display Raw Markdown or HTML. */
  preview: PropTypes.bool,
  /** Enable/Disable editability. */
  editable: PropTypes.bool,
};

BlockEditable.defaultProps = {
  markdown: '',
  onEdit: () => {},
  inputFilters: [],
  outputFilters: [],
  style: {},
  preview: true,
  editable: true,
};

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  html: {
    height: '100%',
    width: 'calc(100% - 1em)',
    display: 'grid',
    padding: '0 0.5em',
    lineHeight: '1.4',
  },
  markdown: {
    height: '100%',
    width: 'calc(100% - 1em)',
    // fontSize: '1.1em',
    display: 'grid',
    whiteSpace: 'pre-wrap',
    paddingBlockStart: '1em',
    paddingBlockEnd: '1em',
    fontSize: 'unset',
    fontFamily: 'unset',
    padding: '0 0.5em',
    lineHeight: '1.4',
  },
  pre: {
    margin: 0,
    fontFamily: 'unset',
    fontSize: 'unset',
  },
}));

const areEqual = (prevProps, nextProps) => {
  const keys = ['markdown', 'preview', 'editable', 'style'];
  const checks = keys.map(key => (JSON.stringify(prevProps[key]) === JSON.stringify(nextProps[key])));
  const equal = !checks.includes(false);
  // console.log('BlockEditable', keys, checks, equal);
  return equal;
};

// BlockEditable.whyDidYouRender = true;
const MemoComponent = React.memo(BlockEditable, areEqual);
export default MemoComponent;
