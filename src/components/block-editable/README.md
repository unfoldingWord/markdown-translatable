### Toggle Raw Markdown and HTML Editing.

```jsx
initialState = {
  markdown: "**Hello** _world_",
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
    markdown={state.markdown}
    preview={state.preview}
    onEdit={(_markdown) => {
      setState({ markdown: _markdown });
    }}
  />
</div>;
```
