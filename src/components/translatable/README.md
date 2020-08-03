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
}

<Component />;
```
