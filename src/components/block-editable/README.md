### Toggle Raw Markdown and HTML Editing.

```jsx
initialState = {
  markdown: `#### Having BIRTH PAINS mean suffering that is necessary to achieve a new condition
  
> ***Be in pain and labor to give birth***, daughter of Zion, like a ***woman in labor***.  
> For now you will go out of the city, live in the field, and go to Babylon.  
> There you will be rescued.  
> There Yahweh will rescue you from the hand of your enemies. (Micah 4:10 ULT)
  
> For nation will rise against nation, and kingdom against kingdom. There will be famines and earthquakes in various places. But all these things are only the beginning of ***birth pains***. (Matthew 24:7-8 ULT)
  
> My little children, I am suffering ***labor pains*** for you again, until Christ will have been formed in you! (Galatians 4:19 ULT)`,
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
