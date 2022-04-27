### Toggle Raw Markdown and HTML Editing.

```jsx
initialState = {
  markdown: `# Heading 1
  **Hello** __world__`,
  preview: false,
};

<div>
  <button
    onClick={() => {
      console.log('--- --- ---');
      console.log('Current state:' + state.markdown);
      setState({ preview: !state.preview });
    }}
  >
    {!state.preview ? 'Markdown' : 'HTML'}
  </button>
  <BlockEditable
    markdown={state.markdown}
    preview={state.preview}
    onEdit={(_markdown) => {
      console.log('--- --- ---');
      console.log('Current state:' + state.markdown);
      console.log('Setting new state: ' + _markdown);
      setState({ _markdown });
    }}
    fontSize="100%"
  />
</div>;
```

### Detect Hebrew and Zoom

If the text includes over 75% hebrew characters it will zoom by 150% using `font-size: 1.5em`.

```jsx
initialState = {
  markdown:
    'שֻׁדַּ֣ד שָׂדֶ֔ה אָבְלָ֖האֲדָמָ֑ה כִּ֚י שֻׁדַּ֣ד דָּגָ֔ןהוֹבִ֥ישׁ תִּיר֖וֹשׁ אֻמְלַ֥ליִצְהָֽר׃',
  preview: false,
};

<div>
  <button
    onClick={() => {
      console.log('--- --- ---');
      console.log('Current state:' + state.markdown);
      setState({ preview: !state.preview });
    }}
  >
    {!state.preview ? 'Markdown' : 'HTML'}
  </button>
  <BlockEditable
    markdown={state.markdown}
    preview={state.preview}
    onEdit={(_markdown) => {
      console.log('--- --- ---');
      console.log('Current state:' + state.markdown);
      console.log('Setting new state: ' + _markdown);
      setState({ _markdown });
    }}
  />
</div>;
```

### A more complex example...

```jsx
import React, { useContext, useMemo } from 'react';
import { MarkdownContext, MarkdownContextProvider } from '../Markdown.context'

const _markdown = `
# Edit Markdown as HTML!<br><br>No *Frills* **Markdown** __WYSIWYG__.

1. Custom <u>input/output</u> filters.
1. Custom __styles__, this is an ugly example.
1. Save changes __callback__ via onBlur event.
1. HTML and __raw__ Markdown render modes.

# Sections and Blocks

<blockquote>blockquote</blockquote>

- Markdown Heading Sections are split out only in the DocumentTranslatable component and render a SectionTranslatable component for each section.
- Markdown Blocks are split out only in the SectionTranslatable component and render a BlockTranslatable component for each block.
`;

const style = {
  width: '20em',
  color: 'gray',
  border: '1px dashed',
  fontFamily: 'Arial',
};

initialState = {
  markdown: _markdown,
  raw: false,
};

const callback = (markdown) => {
  // do something when the user exits editing element (onBlur).
  setState({ markdown });
  alert(markdown);
};

function Component() {
  const { state: markdownState } = useContext(MarkdownContext);

  return useMemo(() => (
    <>
      <div>Changed? {markdownState.isChanged.toString()}</div>
      <BlockEditable
        markdown={state.markdown}
        preview={state.preview}
        onEdit={callback}
        inputFilters={[
          [/<br>/gi, '\n'],
          [/(<u>|<\/u>)/gi, '__'],
        ]}
        outputFilters={[[/\n/gi, '<br>']]}
        style={style}
      />
    </>
  ), [markdownState]);
}

<div>
  <button onClick={() => setState({ preview: !state.preview })}>
    {!state.preview ? 'Markdown' : 'HTML'}
  </button>
  <MarkdownContextProvider>
    <Component/>
  </MarkdownContextProvider>
</div>;
```
