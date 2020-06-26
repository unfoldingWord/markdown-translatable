import React, { useCallback } from 'react';

import { filter, toDisplay, fromDisplay } from '../../core/';
import { useStyles } from './useStyles';

function BlockEditableMarkdown({
  markdown,
  onEdit,
  inputFilters,
  outputFilters,
  style,
  preview,
  editable,
  handleBlur,
}) {
  const classes = useStyles();

  const handleRawBlur = useCallback(
    (e) => {
      let string = e.target.innerText;
      string = fromDisplay(string);
      const _markdown = filter({ string, filters: outputFilters });
      handleBlur(_markdown);
    },
    [outputFilters]
  );

  let code = filter({ string: markdown, filters: inputFilters });
  code = toDisplay(code);
  const dangerouslySetInnerHTML = { __html: code };

  let _component = (
    <pre className={classes.pre}>
      <code
        className={classes.markdown}
        style={style}
        dir='auto'
        contentEditable={editable}
        onBlur={handleRawBlur}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    </pre>
  );

  return _component;
}

export default BlockEditableMarkdown;
