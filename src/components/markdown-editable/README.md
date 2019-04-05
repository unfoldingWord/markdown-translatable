Toggle Raw Markdown and HTML Editing.

```jsx
initialState = {
  markdown: '# Hello World',
  raw: true,
};
<div>
  <button
    onClick={() => setState({ raw: !state.raw })}
  >
    {state.raw ? 'Markdown' : 'HTML'}
  </button>
  <MarkdownEditable
    markdown={state.markdown}
    raw={state.raw}
    handleChange={(markdown) =>
      setState({ markdown })
    }
  />
</div>
```

A more complex example...

```jsx
const _markdown = "# Edit Markdown as HTML!<br>No *Frills* **Markdown** __WYSIWYG__.\n"
  + "1. Custom <u>input/output</u> filters. \n"
  + "1. Custom __styles__, this is an ugly example. \n"
  + "1. Save changes __callback__ via onBlur event. \n"
  + "1. HTML and __raw__ Markdown render modes. \n";
  const callback = (markdown) => {
  // do something when the user exits editing element (onBlur).
  alert(markdown);
};
const style = {
  width: '20em',
  fontSize: '0.9em',
  color: 'blue',
  border: '1px dashed',
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
  <MarkdownEditable
    markdown={state.markdown}
    raw={state.raw}
    handleChange={(markdown) =>
      setState({ markdown })
    }
    inputFilters={[[/<br>/gi, "\n"],[/(<u>|<\/u>)/gi, '__']]}
    outputFilters={[["\n", "<br>"]]}
    style={style}
  />
</div>
```
