### Toggle Raw Markdown and HTML Editing.

```jsx
import { useState } from 'react'
const [
  markdown,
  setMarkdown
] = useState(`#### Having BIRTH PAINS mean suffering that is necessary to achieve a new condition
  
> ***Be in pain and labor to give birth***, daughter of Zion, like a ***woman in labor***.  
> For now you will go out of the city, live in the field, and go to Babylon.  
> There you will be rescued.  
> There Yahweh will rescue you from the hand of your enemies. (Micah 4:10 ULT)
  
> For nation will rise against nation, and kingdom against kingdom. There will be famines and earthquakes in various places. But all these things are only the beginning of ***birth pains***. (Matthew 24:7-8 ULT)
  
> My little children, I am suffering ***labor pains*** for you again, until Christ will have been formed in you! (Galatians 4:19 ULT)`)
const [preview, setPreivew] = useState(false)
;<div>
  <button onClick={() => setPreivew(!preview)}>
    {!preview ? 'Markdown' : 'HTML'}
  </button>
  <BlockEditable markdown={markdown} preview={preview} onEdit={setMarkdown} />
</div>
```

### Detect Hebrew and Zoom

If the text includes over 75% hebrew characters it will zoom by 150% using `font-size: 1.5em`.

```jsx
initialState = {
  markdown:
    'שֻׁדַּ֣ד שָׂדֶ֔ה אָבְלָ֖האֲדָמָ֑ה כִּ֚י שֻׁדַּ֣ד דָּגָ֔ןהוֹבִ֥ישׁ תִּיר֖וֹשׁ אֻמְלַ֥ליִצְהָֽר׃',
  preview: false
}
;<div>
  <button
    onClick={() => {
      console.log('--- --- ---')
      console.log('Current state:' + state.markdown)
      setState({ preview: !state.preview })
    }}
  >
    {!state.preview ? 'Markdown' : 'HTML'}
  </button>
  <BlockEditable
    markdown={state.markdown}
    preview={state.preview}
    onEdit={_markdown => {
      console.log('--- --- ---')
      console.log('Current state:' + state.markdown)
      console.log('Setting new state: ' + _markdown)
      setState({ _markdown })
    }}
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

# Sections and Blocks

<blockquote>blockquote</blockquote>

- Markdown Heading Sections are split out only in the DocumentTranslatable component and render a SectionTranslatable component for each section.
- Markdown Blocks are split out only in the SectionTranslatable component and render a BlockTranslatable component for each block.
`

const style = {
  width: '20em',
  color: 'gray',
  border: '1px dashed',
  fontFamily: 'Arial'
}

initialState = {
  markdown: _markdown,
  raw: false
}

const callback = markdown => {
  // do something when the user exits editing element (onBlur).
  setState({ markdown })
  alert(markdown)
}

;<div>
  <button onClick={() => setState({ preview: !state.preview })}>
    {!state.preview ? 'Markdown' : 'HTML'}
  </button>
  <BlockEditable
    markdown={state.markdown}
    preview={state.preview}
    onEdit={callback}
    inputFilters={[
      [/<br>/gi, '\n'],
      [/(<u>|<\/u>)/gi, '__']
    ]}
    outputFilters={[[/\n/gi, '<br>']]}
    style={style}
  />
</div>
```
