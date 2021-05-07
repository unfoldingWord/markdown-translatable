import React, {
  useMemo, useCallback, useContext,
} from 'react';
import PropTypes from 'prop-types';

import * as helpers from '../../core/';
import {
  markdownToHtml,
  htmlToMarkdown,
  filter,
  fromDisplay,
  toDisplay,
} from '../../core/';
import { MarkdownContext } from '../Markdown.context';
import { useStyles } from './useStyles';


function BlockEditable({
  markdown,
  onEdit,
  inputFilters,
  outputFilters,
  style,
  preview,
  editable,
  fontSize,
}) {
  const classes = useStyles({ fontSize });
  const { actions } = useContext(MarkdownContext);
  const _oldMarkdown = { markdown };

  const _style = useMemo(
    () =>
      helpers.isHebrew(markdown) ? { ...style, fontSize: '1.5em' } : style,
    [style, markdown]
  );

  const handleBlur = useCallback(
    (_markdown) => {
      const oldHTML = markdownToHtml({
        markdown: _oldMarkdown.markdown,
        inputFilters: inputFilters,
      });
      const newHTML = markdownToHtml({
        markdown: _markdown,
        inputFilters: inputFilters,
      });

      if (oldHTML !== newHTML || _oldMarkdown.markdown !== _markdown) {
        _oldMarkdown.markdown = _markdown;
        onEdit(_markdown);
      }
    },
    [_oldMarkdown.markdown, inputFilters, onEdit]
  );

  const handleHTMLBlur = useCallback(
    (e) => {
      const html = e.target.innerHTML;
      const _markdown = htmlToMarkdown({ html, outputFilters });
      handleBlur(_markdown);
    },
    [handleBlur, outputFilters]
  );

  const handleRawBlur = useCallback(
    (e) => {
      let string = e.target.innerText;
      string = fromDisplay(string);
      const _markdown = filter({ string, filters: outputFilters });
      handleBlur(_markdown);
    },
    [handleBlur, outputFilters]
  );

  const handleKeyDown = useCallback(
    () => {
      if (actions && actions.setIsChanged) {
        actions.setIsChanged(true);
      }
    }, [actions]
  );

  const component = useMemo(() => {
    let _component;

    if (!preview) {
      let code = filter({ string: markdown, filters: inputFilters });
      code = toDisplay(code);
      const dangerouslySetInnerHTML = { __html: code };

      _component = (
        <pre className={classes.pre}>
          <code
            className={classes.markdown}
            style={{ ..._style, fontSize }}
            dir='auto'
            contentEditable={editable}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
            onBlur={handleRawBlur}
            onKeyDown={handleKeyDown}
          />
        </pre>
      );
    } else {
      const dangerouslySetInnerHTML = { __html: markdownToHtml({ markdown, inputFilters }) };

      _component = (
        <div
          style={{ ..._style, fontSize }}
          className={classes.html}
          dir='auto'
          contentEditable={editable}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
          onBlur={handleHTMLBlur}
          onKeyPress={handleKeyDown}
        />
      );
    }
    return _component;
  }, [preview, markdown, inputFilters, classes.pre, classes.markdown, classes.html, _style, fontSize, editable, handleRawBlur, handleKeyDown, handleHTMLBlur]);

  return <div className={classes.root}>{component}</div>;
}

BlockEditable.propTypes = {
  /** Initial markdown for the editor. */
  markdown: PropTypes.string.isRequired,
  /** Function to propogate changes to the markdown. */
  onEdit: PropTypes.func,
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
  /** fontSize e.g. '100%' */
  fontSize: PropTypes.string,
};

BlockEditable.defaultProps = {
  markdown: '',
  onEdit: () => { },
  inputFilters: [],
  outputFilters: [],
  style: {},
  preview: true,
  editable: true,
};

export default BlockEditable;
