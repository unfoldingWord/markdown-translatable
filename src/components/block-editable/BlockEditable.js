import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import * as helpers from '../../core/';
import { markdownToHtml } from '../../core/';
import { useStyles } from './useStyles';

import BlockEditableMarkdown from './BlockEditableMarkdown';
import BlockEditablePreview from './BlockEditablePreview';

function BlockEditable({
  markdown,
  onEdit,
  inputFilters,
  outputFilters,
  style,
  preview,
  editable,
}) {
  const _oldMarkdown = { current: markdown };

  const classes = useStyles();

  const _style = useMemo(
    () =>
      helpers.isHebrew(markdown) ? { ...style, fontSize: '1.5em' } : style,
    [style, markdown]
  );

  const handleBlur = useCallback(
    (_markdown) => {
      const oldHTML = markdownToHtml({
        markdown: _oldMarkdown.current,
        inputFilters: inputFilters,
      });
      const newHTML = markdownToHtml({
        markdown: _markdown,
        inputFilters: inputFilters,
      });

      _oldMarkdown.current = _markdown;

      if (oldHTML !== newHTML) onEdit(_markdown);
    },
    [markdown, inputFilters]
  );

  const component = useMemo(() => {
    let _component;

    if (!preview) {
      _component = (
        <BlockEditableMarkdown
          markdown={markdown}
          onEdit={onEdit}
          inputFilters={inputFilters}
          outputFilters={outputFilters}
          style={_style}
          preview={preview}
          editable={editable}
          handleBlur={handleBlur}
        />
      );
    } else {
      _component = (
        <BlockEditablePreview
          markdown={markdown}
          onEdit={onEdit}
          inputFilters={inputFilters}
          outputFilters={outputFilters}
          style={_style}
          preview={preview}
          editable={editable}
          handleBlur={handleBlur}
        />
      );
    }
    return _component;
  }, [preview, markdown, inputFilters, editable]);

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

export default BlockEditable;
