### Toggle Raw Markdown and HTML Editing.

```jsx
initialState = {
  markdown: `# Titus 02 General Notes
## Special concepts in this chapter

### Gender roles`,
  preview: true,
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
