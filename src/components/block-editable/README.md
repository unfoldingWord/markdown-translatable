### Toggle Raw Markdown and HTML Editing.

```jsx
initialState = {
  markdown: `Possible meanings are 1) "the believers who love us" or 2) "the believers who love us because we share the same belief."`,
  preview: false,
};

<div>
  <button
    onClick={() => {
      setState({ preview: !state.preview });
    }}
  >
    {!state.preview ? "Preview" : "Raw Markdown"}
  </button>
  <BlockEditable
    debounce={500}
    markdown={state.markdown}
    preview={state.preview}
    onEdit={(_markdown) => {
      console.log("_markdown", _markdown);
      setState({ markdown: _markdown });
    }}
  />
</div>;
```
