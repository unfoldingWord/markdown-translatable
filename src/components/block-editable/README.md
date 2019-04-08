### Toggle Raw Markdown and HTML Editing.

```jsx
initialState = {
  markdown: '**Hello** __world__',
  raw: true,
};
<div>
  <button
    onClick={() => setState({ raw: !state.raw })}
  >
    {state.raw ? 'Markdown' : 'HTML'}
  </button>
  <BlockEditable
    markdown={state.markdown}
    raw={state.raw}
    handleChange={(markdown) =>
      setState({ markdown })
    }
  />
</div>
```

### A more complex example...

```jsx
const _markdown = `
# Edit Markdown as HTML!<br><br>No *Frills* **Markdown** __WYSIWYG__.

1. Custom <u>input/output</u> filters.
1. Custom __styles__, this is an ugly example.
1. Save changes __callback__ via onBlur event.
1. HTML and __raw__ Markdown render modes.

# Another Section

You can edit separate sections.`;

  const callback = (markdown) => {
  // do something when the user exits editing element (onBlur).
  alert(markdown);
};
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
<div>
  <button
    onClick={() => setState({ raw: !state.raw })}
  >
    {state.raw ? 'Markdown' : 'HTML'}
  </button>
  <BlockEditable
    markdown={state.markdown}
    raw={state.raw}
    handleChange={(markdown) =>
      setState({ markdown })
    }
    inputFilters={[[/<br>/gi, "\n"],[/(<u>|<\/u>)/gi, '__']]}
    outputFilters={[[/\n/gi, "<br>"]]}
    style={style}
  />
</div>
```
