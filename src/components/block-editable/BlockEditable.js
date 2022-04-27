import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  markdownToHtml,
  htmlToMarkdown,
  fromDisplay,
  toDisplay,
  isHebrew,
  filter,
} from '../../core/';
import { MarkdownContext } from '../Markdown.context';
import { useStyles } from './useStyles';

export default function BlockEditable({
  markdown,
  onEdit,
  inputFilters,
  outputFilters,
  style,
  preview,
  editable,
  fontSize,
}) {
  const classes = useStyles();
  const { actions } = useContext(MarkdownContext);
  const _oldMarkdown = { markdown };

  const _style = useMemo(
    () =>
      isHebrew(markdown) ? { ...style, fontSize: '1.5em' } : style,
    [style, markdown]
  );

  const handleBlur = (_markdown) => {
    const oldHTML = markdownToHtml({
      markdown: _oldMarkdown.markdown,
      inputFilters: inputFilters,
    });
    const newHTML = markdownToHtml({
      markdown: _markdown,
      inputFilters: inputFilters,
    });

    // TODO: do we need to calculate HTML each time??
    if (oldHTML !== newHTML || _oldMarkdown.markdown !== _markdown) {
      _oldMarkdown.markdown = _markdown;
      onEdit(_markdown);
    }
  };

  const handleHTMLBlur = (e) => {
    const html = e.target.innerHTML;
    const _markdown = htmlToMarkdown({ html, outputFilters });
    handleBlur(_markdown);
  };

  const handleRawBlur = (e) => {
    let string = e.target.innerText;
    string = fromDisplay(string);
    const _markdown = filter({ string, filters: outputFilters });
    handleBlur(_markdown);
  };

  const handleKeyPress = (keycode) => {
    if (actions && actions.setIsChanged) {
      actions.setIsChanged(true);
    }
  };

  const handledKeyCodes = [8/*Delete/Backspace*/];

  const handleKeyUp = (event) => {
    if (actions && actions.setIsChanged) {
      if (handledKeyCodes.includes(event.keyCode)) {
        // NOTE: we don't want to convert HTML on key keyUp.
        // So we cant test for changes.
        actions.setIsChanged(true);
      }
    }
  };

  const handleCutPaste = () => {
    if (actions && actions.setIsChanged) {
      actions.setIsChanged(true);
    }

    if (actions && actions.setIsAutoSaveChanged) {
      actions.setIsAutoSaveChanged(true);
    }
  };

  document.querySelector('[contenteditable]')
    ?.addEventListener('paste', function (e) {
    e.preventDefault()
    var text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    })

  return (
    <div className={classes.root}>
      {
        !preview ?
          <RawMarkdown
            _style={_style}
            classes={classes}
            fontSize={fontSize}
            markdown={markdown}
            editable={editable}
            handleKeyUp={handleKeyUp}
            inputFilters={inputFilters}
            handleRawBlur={handleRawBlur}
            handleKeyPress={handleKeyPress}
            handleCutPaste={handleCutPaste}
          />
          :
          <div
            style={{ ..._style, fontSize }}
            className={classes.html}
            dir='auto'
            contentEditable={editable}
            onBlur={handleHTMLBlur}
            onKeyPress={handleKeyPress}
            onKeyUp={handleKeyUp}
            onCut={handleCutPaste}
            onPaste={handleCutPaste}
            data-test="blockeditable-editable-markdown-rawmarkdown"
            dangerouslySetInnerHTML={{ __html: markdownToHtml({ markdown, inputFilters }) }}
          />
      }
    </div>
  );
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

const RawMarkdown = ({
  _style,
  classes,
  fontSize,
  markdown,
  editable,
  handleKeyUp,
  inputFilters,
  handleRawBlur,
  handleKeyPress,
  handleCutPaste,
}) => {
  let code = filter({ string: markdown, filters: inputFilters });
  code = toDisplay(code);
  const dangerouslySetInnerHTML = { __html: code };

  return (
    <div 
        className={classes.markdown}
        // style={{ ..._style, fontSize, whiteSpace: 'pre-wrap' }}
        dir='auto'
        contentEditable={editable}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        onBlur={handleRawBlur}
        onKeyPress={handleKeyPress}
        onKeyUp={handleKeyUp}
        onCut={handleCutPaste}
        onPaste={handleCutPaste}
        data-test="blockeditable-editable-markdown-pre"
      >
    </div>
  );
};

RawMarkdown.propTypes = {
  /** CSS for the component. */
  _style: PropTypes.object,
  /** CSS classes for the component. */
  classes: PropTypes.object,
  /** fontSize e.g. '100%' */
  fontSize: PropTypes.string,
  /** Initial markdown for the editor. */
  markdown: PropTypes.string.isRequired,
  /** Enable/Disable editability. */
  editable: PropTypes.bool,
  /** Function to handle Key Up. */
  handleKeyUp: PropTypes.func,
  /** Replace strings before rendering. */
  inputFilters: PropTypes.array,
  /** Function to handle raw on blur. */
  handleRawBlur: PropTypes.func,
  /** Function to handle key pres. */
  handleKeyPress: PropTypes.func,
  /** Function to handle cur & paste. */
  handleCutPaste: PropTypes.func,
};
