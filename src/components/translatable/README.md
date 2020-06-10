### Based on DocumentTranslatable and SectionTranslatable components.
1. Original/source on the Left, un-editable.
1. Translation/target on the right, editable with changes that propagate.

```jsx
const markdown = "**Hello** __world__";
const _translation = "**नमस्ते** __दुनिया__";

function Component() {
  const [translation, setTranslation] = React.useState(_translation);

  return (
    <Translatable
      original={markdown}
      translation={translation}
      onTranslation={setTranslation}
      sectionable={true}
    />
  );
};

<Component />
```

### A more complex example...

```jsx
const markdown = `
# Edit Markdown as HTML!<br><br>No *Frills* **Markdown** __WYSIWYG__.

1. Custom <u>input/output</u> filters.
1. Custom __styles__, this is an ugly example.
1. Save changes __callback__ via onBlur event.
1. HTML and __raw__ Markdown render modes.

## Subsection A

This is subsection A, paragraph 1.

This is subsection A, paragraph 2.

## Subsection B

This is subsection B, paragraph 1.

This is subsection B, paragraph 2.

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

## Subsection A

This is subsection A, paragraph 1.

This is subsection A, paragraph 2.

## Subsection B

This is subsection B, paragraph 1.

This is subsection B, paragraph 2.

# खंड और खंड

- मार्कडाउन हेडिंग सेक्शंस को केवल डॉक्यूमेंटट्रांसलेटेबल कंपोनेंट में विभाजित किया गया है और प्रत्येक सेक्शन के लिए एक सेक्शन ट्रांसलेटेबल कंपोनेंट को रेंडर किया गया है।
- मार्कडाउन ब्लॉक केवल सेक्शनट्रांसलेबल कंपोनेंट में विभाजित हो जाते हैं और प्रत्येक ब्लॉक के लिए ब्लॉकट्रांसलेबल कंपोनेंट को रेंडर करते हैं।

# Extra Section

This section represents extra content needed by the translation, but not actually in the source.
It might be end notes or appendices.
`;

const [translation, setTranslation] = React.useState(_translation);
const [mode, setMode] = React.useState(true);
const toggleMode = () => { setMode(!mode); };

React.useEffect(() => {
  if (mode) setTranslation(_translation);
  else setTranslation(markdown);
},[mode, _translation, markdown]);

<>
  <Translatable
    original={markdown}
    translation={translation}
    onTranslation={setTranslation}
    inputFilters={[[/<br>/gi, "\n"],[/(<u>|<\/u>)/gi, '__']]}
    outputFilters={[]}
    sectionable={true}
  />
</>
```
