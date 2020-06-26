import React, { useCallback } from 'react';

import { markdownToHtml, htmlToMarkdown } from '../../core/';
import { useStyles } from './useStyles';

function BlockEditablePreview({
  markdown,
  inputFilters,
  outputFilters,
  style,
  editable,
  handleBlur,
}) {
  const classes = useStyles();

  const handleHTMLBlur = useCallback(
    (e) => {
      const html = e.target.innerHTML;
      const _markdown = htmlToMarkdown({ html, outputFilters });
      handleBlur(_markdown);
    },
    [outputFilters]
  );

  const dangerouslySetInnerHTML = {
    __html: markdownToHtml({ markdown, inputFilters }),
  };

  let _component = (
    <div
      style={style}
      className={classes.html}
      dir='auto'
      contentEditable={editable}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      onBlur={handleHTMLBlur}
    />
  );

  return _component;
}

export default BlockEditablePreview;
