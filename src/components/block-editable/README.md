### Toggle Raw Markdown and HTML Editing.

```jsx
initialState = {
  markdown: `**_bold italic_**`,
  preview: false,
};

<div>
  <button
    onClick={() => {
      console.log("markdown", state.markdown);
      setState({ preview: !state.preview });
    }}
  >
    {!state.preview ? "Markdown" : "HTML"}
  </button>
  <BlockEditable
    markdown={state.markdown}
    preview={state.preview}
    onEdit={(_markdown) => {
      console.log("markdown", _markdown);
      setState({ markdown: _markdown });
    }}
  />
</div>;
```
