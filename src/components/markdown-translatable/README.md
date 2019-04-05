Toggle Raw Markdown and HTML Translating.

```jsx
const markdown = "**Hello** __world__";
const translation = "**नमस्ते** __दुनिया__";
const style = {
  fontSize: '0.9em',
  color: 'blue',
  border: '1px dashed',
};
initialState = {
  translation,
  raw: false,
};
<div>
  <button
    onClick={() => setState({ raw: !state.raw })}
  >
    {state.raw ? 'Markdown' : 'HTML'}
  </button>
  <MarkdownTranslatable
    original={markdown}
    translation={state.translation}
    raw={state.raw}
    handleChange={(translation) =>
      setState({ translation })
    }
    inputFilters={[[/<br>/gi, "\n"],[/(<u>|<\/u>)/gi, '__']]}
    outputFilters={[["\n", "<br>"]]}
    style={style}
  />
</div>
```

A more complex example...

```jsx
const markdown = "# Edit Markdown as HTML!<br><br>No *Frills* **Markdown** __WYSIWYG__.\n"
  + "1. Custom <u>input/output</u> filters. \n"
  + "1. Custom __styles__, this is an ugly example. \n"
  + "1. Save changes __callback__ via onBlur event. \n"
  + "1. HTML and __raw__ Markdown render modes. \n";
const translation = "# HTML के रूप में मार्कडाउन संपादित करें!<br><br>नो *फ्रिल्स* **मार्कडाउन** __WYSIWYG__।\n"
  + "1. कस्टम __इनपुट/आउटपुट__ फ़िल्टर।\n"
  + "1. कस्टम __शैलियाँ__, यह एक बदसूरत उदाहरण है।\n"
  + "1. onBlur इवेंट के माध्यम से परिवर्तन __कॉलबैक__ सहेजें।\n"
  + "1. HTML और __कच्चे__ मार्कडाउन रेंडर मोड।";
const style = {
  fontSize: '0.9em',
  color: 'blue',
  border: '1px dashed',
};
initialState = {
  translation,
  raw: false,
};
<div>
  <button
    onClick={() => setState({ raw: !state.raw })}
  >
    {state.raw ? 'Markdown' : 'HTML'}
  </button>
  <MarkdownTranslatable
    original={markdown}
    translation={state.translation}
    raw={state.raw}
    handleChange={(translation) =>
      setState({ translation })
    }
    inputFilters={[[/<br>/gi, "\n"],[/(<u>|<\/u>)/gi, '__']]}
    outputFilters={[["\n", "<br>"]]}
    style={style}
  />
</div>
```
