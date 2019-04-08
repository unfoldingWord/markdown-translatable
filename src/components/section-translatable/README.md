### Based on BlockTranslatable components.
1. Original/source on the Left, un-editable.
1. Translation/target on the right, editable with changes that propagate.

### Toggle Raw Markdown and HTML Translating.

```jsx
const markdown = "**Hello** __world__";
const translation = "**नमस्ते** __दुनिया__";

initialState = {
  translation,
};

<SectionTranslatable
  original={markdown}
  translation={state.translation}
  raw={state.raw}
  handleChange={(translation) =>
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

const translation = `
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

<SectionTranslatable
  original={markdown}
  translation={translation}
  handleChange={(_translation) =>
    alert(_translation)
  }
  inputFilters={[[/<br>/gi, "\n"],[/(<u>|<\/u>)/gi, '__']]}
  outputFilters={[]}
  style={style}
/>
```
