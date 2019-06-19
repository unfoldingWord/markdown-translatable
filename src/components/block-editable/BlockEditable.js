import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import * as helpers from './helpers';

const whyDidYouRender = (process.env.NODE_ENV !== 'production') ?
  require('@welldone-software/why-did-you-render') : undefined;
if (whyDidYouRender) whyDidYouRender(React);
/**
 * ### A reusable component for translating a Markdown block as HTML.
 * @component
 */
function BlockEditable({
  classes,
  markdown,
  onEdit,
  inputFilters,
  outputFilters,
  style,
  raw,
  editable,
}) {
  let component;

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
    const _markdown = helpers.filter({
      string: e.target.innerText,
      filters: outputFilters
    });
    handleBlur(_markdown);
  };

  
  if (raw) {
    const dangerouslySetInnerHTML = { __html: markdown };
    component = (
      <div
        className={classes.markdown}
      >
        <pre
          className={classes.pre}
          dir="auto"
          contentEditable={editable}
          onBlur={handleRawBlur}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      </div>
    );
  } else {
    const dangerouslySetInnerHTML = { __html: helpers.markdownToHtml({markdown, inputFilters}) };
    component = (
      <div
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
      style={style}
    >
      <div
        className={classes.wrapper}
      >
        {component}
      </div>
    </div>
  );
};

BlockEditable.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
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
  raw: PropTypes.bool,
  /** Enable/Disable editability. */
  editable: PropTypes.bool,
};

BlockEditable.defaultProps = {
  markdown: '',
  onEdit: () => {},
  inputFilters: [],
  outputFilters: [],
  style: {},
  raw: false,
  editable: true,
};

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  wrapper: {
    height: '100%',
    padding: '0 0.5em',
  },
  html: {
    height: '100%',
    width: '100%',
    display: 'grid',
  },
  markdown: {
    height: '100%',
    width: '100%',
    fontSize: '1.1em',
    display: 'grid',
  },
  pre: {
    whiteSpace: 'pre-wrap',
  },
});

const areEqual = (prevProps, nextProps) => {
  const keys = ['markdown', 'raw', 'editable', 'style'];
  const checks = keys.map(key => (JSON.stringify(prevProps[key]) === JSON.stringify(nextProps[key])));
  const equal = !checks.includes(false);
  // console.log('BlockEditable', keys, checks, equal);
  return equal;
};

BlockEditable.whyDidYouRender = true;
const StyleComponent = withStyles(styles)(BlockEditable);
const MemoComponent = React.memo(StyleComponent, areEqual);
export default MemoComponent;
