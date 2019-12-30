```js

const [sectionable, setSectionable] = React.useState(true);
const [preview, setPreview] = React.useState(true);
const [changed, setChanged] = React.useState(true);

const saveTranslation = React.useCallback(() => setChanged(!changed), [changed]);

<Actions
  sectionable={sectionable}
  onSectionable={setSectionable}
  preview={preview}
  onPreview={setPreview}
  changed={changed}
  onSave={saveTranslation}
/>
```