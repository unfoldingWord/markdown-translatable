### Based on SectionTranslatable components.
1. Original/source on the Left, un-editable.
1. Translation/target on the right, editable with changes that propagate.

### Toggle Raw Markdown and HTML Translating.

```jsx
const markdown = "**Hello** __world__";
const _translation = "**नमस्ते** __दुनिया__";

initialState = {
  translation: _translation,
};

<DocumentTranslatable
  original={markdown}
  translation={state.translation}
  onTranslation={(translation) =>
    setState({ translation })
  }
/>
```

### A more complex example...

```jsx
const markdown = `
# Edit Markdown as HTML!<br><br>No *Frills* **Markdown** __WYSIWYG__.

1. Custom <u>input/output</u> filters.
1. Custom __styles__, this is an ugly example.
1. Save changes __callback__ via onBlur event.
1. HTML and __raw__ Markdown render modes.

# Sections and Blocks

- Markdown Heading Sections are split out only in the DocumentTranslatable component and render a SectionTranslatable component for each section.
- Markdown Blocks are split out only in the SectionTranslatable component and render a BlockTranslatable component for each block.
`;

const _translation = `
# HTML के रूप में मार्कडाउन संपादित करें!<br><br>नो *फ्रिल्स* **मार्कडाउन** __WYSIWYG__।

1. कस्टम __इनपुट/आउटपुट__ फ़िल्टर।
1. कस्टम __शैलियाँ__, यह एक बदसूरत उदाहरण है।
1. onBlur इवेंट के माध्यम से परिवर्तन __कॉलबैक__ सहेजें।
1. HTML और __कच्चे__ मार्कडाउन रेंडर मोड।

# खंड और खंड

- मार्कडाउन हेडिंग सेक्शंस को केवल डॉक्यूमेंटट्रांसलेटेबल कंपोनेंट में विभाजित किया गया है और प्रत्येक सेक्शन के लिए एक सेक्शन ट्रांसलेटेबल कंपोनेंट को रेंडर किया गया है।
- मार्कडाउन ब्लॉक केवल सेक्शनट्रांसलेबल कंपोनेंट में विभाजित हो जाते हैं और प्रत्येक ब्लॉक के लिए ब्लॉकट्रांसलेबल कंपोनेंट को रेंडर करते हैं।
`;

const style = {
  fontSize: '0.9em',
  color: 'gray',
  border: '1px solid',
  fontFamily: 'Arial',
};

const [translation, setTranslation] = React.useState(_translation);
const [mode, setMode] = React.useState(true);
const toggleMode = () => { setMode(!mode); };

React.useEffect(() => {
  if (mode) setTranslation(_translation);
  else setTranslation(markdown);
},[mode, _translation, markdown]);

<>
  <div onClick={toggleMode}>
    Click to switch mode to {!mode ? 'Translate' : 'Edit Source' }
  </div>
  <DocumentTranslatable
    original={markdown}
    translation={translation}
    onTranslation={setTranslation}
    inputFilters={[[/<br>/gi, "\n"],[/(<u>|<\/u>)/gi, '__']]}
    outputFilters={[]}
    style={style}
  />
</>
```

### Example from TW

```jsx
const markdown = `
## Definition:

To love another person is to care for that person and do things that will benefit him. There are different meanings for “love” some languages may express using different words:

1. The kind of love that comes from God is focused on the good of others even when it doesn’t benefit oneself. This kind of love cares for others, no matter what they do. God himself is love and is the source of true love.
    *   Jesus showed this kind of love by sacrificing his life in order to rescue us from sin and death. He also taught his followers to love others sacrificially.
    *   When people love others with this kind of love, they act in ways that show they are thinking of what will cause the others to thrive. This kind of love especially includes forgiving others.
    *   In the ULT, the word “love” refers to this kind of sacrificial love, unless a Translation Note indicates a different meaning.
2. Another word in the New Testament refers to brotherly love, or love for a friend or family member.
    *   This term refers to natural human love between friends or relatives.
    *   The term can also be used in such contexts as, “They love to sit in the most important seats at a banquet.” This means that they “like very much” or “greatly desire” to do that.
3. The word “love” can also refer to romantic love between a man and a woman.
`;

const _translation = `
## Definition:

To love another person is to care for that person and do things that will benefit him. There are different meanings for “love” some languages may express using different words:

1. The kind of love that comes from God is focused on the good of others even when it doesn’t benefit oneself. This kind of love cares for others, no matter what they do. God himself is love and is the source of true love.
    *   Jesus showed this kind of love by sacrificing his life in order to rescue us from sin and death. He also taught his followers to love others sacrificially.
    *   When people love others with this kind of love, they act in ways that show they are thinking of what will cause the others to thrive. This kind of love especially includes forgiving others.
    *   In the ULT, the word “love” refers to this kind of sacrificial love, unless a Translation Note indicates a different meaning.
2. Another word in the New Testament refers to brotherly love, or love for a friend or family member.
    *   This term refers to natural human love between friends or relatives.
    *   The term can also be used in such contexts as, “They love to sit in the most important seats at a banquet.” This means that they “like very much” or “greatly desire” to do that.
3. The word “love” can also refer to romantic love between a man and a woman.
`;

const style = {
  fontSize: '0.9em',
  color: 'gray',
  border: '1px solid',
  fontFamily: 'Arial',
};

const [translation, setTranslation] = React.useState(_translation);
const [mode, setMode] = React.useState(true);
const toggleMode = () => { setMode(!mode); };

React.useEffect(() => {
  if (mode) setTranslation(_translation);
  else setTranslation(markdown);
},[mode, _translation, markdown]);

<>
  <div onClick={toggleMode}>
    Click to switch mode to {!mode ? 'Translate' : 'Edit Source' }
  </div>
  <DocumentTranslatable
    original={markdown}
    translation={translation}
    onTranslation={setTranslation}
    inputFilters={[[/<br>/gi, "\n"],[/(<u>|<\/u>)/gi, '__']]}
    outputFilters={[]}
    style={style}
  />
</>
```
