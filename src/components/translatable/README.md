### Based on DocumentTranslatable and SectionTranslatable components.
1. Original/source on the Left, un-editable.
1. Translation/target on the right, editable with changes that propagate.

```jsx
import { MarkdownContext, MarkdownContextProvider } from '../Markdown.context'

const markdown = "**Hello** __world__\n\nTesting\n\nHello\n\nOne\n\nTwo\n\nThree";
const _translation = "**नमस्ते** __दुनिया__\n\nपरिक्षण\n\nनमस्ते\n\nएक\n\nदो\n\nतीन";

function Component() {
  const [translation, setTranslation] = React.useState(_translation);

  return (
    <MarkdownContextProvider>
        <Translatable
          original={markdown}
          translation={translation}
          onTranslation={setTranslation}
          sectionable={true}
          doPinToolbar={false}
        />
    </MarkdownContextProvider>
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

**Bold** and *italic* and **_bold-italic_** styles.

> But God is the judge;  
> he brings one down and raises up another.  
> For Yahweh holds a cup in his hand of ***foaming wine***,  
> which is mixed with spices, and pours it out.  
> Surely all the wicked of the earth will ***drink it*** to the last drop. (Psalm 75:8 ULT)  
> test-a **test** and **_testing_**  
> test-b **test** and *test*  

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

**Bold** and *italic* and **_bold-italic_** styles.

> But God is the judge;  
> he brings one down and raises up another.  
> For Yahweh holds a cup in his hand of ***foaming wine***,  
> which is mixed with spices, and pours it out.  
> Surely all the wicked of the earth will ***drink it*** to the last drop. (Psalm 75:8 ULT)  
> test-a **test** and **_testing_**  
> test-b **test** and *test*  

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
    doPinToolbar={false}
  />
</>
```
### Example from TW

```jsx
const markdown = `# love, beloved

## Definition:

To love another person is to care for that person and do things that will benefit him. There are different meanings for “love” some languages may express using different words:

1. The kind of love that comes from God is focused on the good of others even when it doesn’t benefit oneself. This kind of love cares for others, no matter what they do. God himself is love and is the source of true love.

    * Jesus showed this kind of love by sacrificing his life in order to rescue us from sin and death. He also taught his followers to love others sacrificially.
    * When people love others with this kind of love, they act in ways that show they are thinking of what will cause the others to thrive. This kind of love especially includes forgiving others.
    * In the ULT, the word “love” refers to this kind of sacrificial love, unless a Translation Note indicates a different meaning.

2. Another word in the New Testament refers to brotherly love, or love for a friend or family member.

    * This term refers to natural human love between friends or relatives.
    * The term can also be used in such contexts as, “They love to sit in the most important seats at a banquet.” This means that they “like very much” or “greatly desire” to do that.

3. The word “love” can also refer to romantic love between a man and a woman.

## Translation Suggestions:

* Unless indicated otherwise in a Translation Note, the word “love” in the ULT refers to the kind of sacrificial love that comes from God.
* Some languages may have a special word for the kind of unselfish, sacrificial love that God has. Ways to translate this might include, “devoted, faithful caring” or “care for unselfishly” or “love from God.” Make sure that the word used to translate God’s love can include giving up one’s own interests to benefit others and loving others no matter what they do.
* Sometimes the English word “love” describes the deep caring that people have for friends and family members. Some languages might translate this with a word or phrase that means “like very much” or “care for” or “have strong affection for.”
* In contexts where the word “love” is used to express a strong preference for something, this could be translated by “strongly prefer” or “like very much” or “greatly desire.”
* Some languages may also have a separate word that refers to romantic or sexual love between a husband and wife.
* Many languages must express “love” as an action. So for example, they might translate “love is patient, love is kind” as, “when a person loves someone, he is patient with him and kind to him.”

(See also: [covenant](../kt/covenant.md), [death](../other/death.md), [sacrifice](../other/sacrifice.md), [save](../kt/save.md), [sin](../kt/sin.md))

## Bible References:

* [1 Corinthians 13:7](rc://en/tn/help/1co/13/07)
* [1 John 3:2](rc://en/tn/help/1jn/03/02)
* [1 Thessalonians 4:10](rc://en/tn/help/1th/04/10)
* [Galatians 5:23](rc://en/tn/help/gal/05/23)
* [Genesis 29:18](rc://en/tn/help/gen/29/18)
* [Isaiah 56:6](rc://en/tn/help/isa/56/06)
* [Jeremiah 2:2](rc://en/tn/help/jer/02/02)
* [John 3:16](rc://en/tn/help/jhn/03/16)
* [Matthew 10:37](rc://en/tn/help/mat/10/37)
* [Nehemiah 9:32-34](rc://en/tn/help/neh/09/32)
* [Philippians 1:9](rc://en/tn/help/php/01/09)
* [Song of Solomon 1:2](rc://en/tn/help/sng/01/02)

## Examples from the Bible stories:

* __[27:2](rc://en/tn/help/obs/27/02)__ The law expert replied that God’s law says, “__Love__ the Lord your God with all your heart, soul, strength, and mind. And __love__ your neighbor as yourself.”
* __[33:8](rc://en/tn/help/obs/33/08)__ “The thorny ground is a person who hears God’s word, but, as time passes, the cares, riches, and pleasures of life choke out his __love__ for God.”
* __[36:5](rc://en/tn/help/obs/36/05)__ As Peter was talking, a bright cloud came down on top of them and a voice from the cloud said, “This is my Son whom I __love__.”
* __[39:10](rc://en/tn/help/obs/39/10)__ “Everyone who __loves__ the truth listens to me.”
* __[47:1](rc://en/tn/help/obs/47/01)__ She (Lydia) __loved__ and worshiped God.
* __[48:1](rc://en/tn/help/obs/48/01)__ When God created the world, everything was perfect. There was no sin. Adam and Eve __loved__ each other, and they __loved__ God.
* __[49:3](rc://en/tn/help/obs/49/03)__ He (Jesus) taught that you need to __love__ other people the same way you love yourself.
* __[49:4](rc://en/tn/help/obs/49/04)__ He (Jesus) also taught that you need to __love__ God more than you __love__ anything else, including your wealth.
* __[49:7](rc://en/tn/help/obs/49/07)__ Jesus taught that God __loves__ sinners very much.
* __[49:9](rc://en/tn/help/obs/49/09)__ But God __loved__ everyone in the world so much that he gave his only Son so that whoever believes in Jesus will not be punished for his sins, but will live with God forever.
* __[49:13](rc://en/tn/help/obs/49/13)__ God __loves__ you and wants you to believe in Jesus so he can have a close relationship with you.

## Word Data:

* Strong’s: H157, H158, H159, H160, H2245, H2617, H2836, H3039, H4261, H5689, H5690, H5691, H7355, H7356, H7453, H7474, G25, G26, G5360, G5361, G5362, G5363, G5365, G5367, G5368, G5369, G5377, G5381, G5382, G5383, G5388
`;

const _translation = `# love, beloved

## Definition:

To love another person is to care for that person and do things that will benefit him. There are different meanings for “love” some languages may express using different words:

1. The kind of love that comes from God is focused on the good of others even when it doesn’t benefit oneself. This kind of love cares for others, no matter what they do. God himself is love and is the source of true love.

    * Jesus showed this kind of love by sacrificing his life in order to rescue us from sin and death. He also taught his followers to love others sacrificially.
    * When people love others with this kind of love, they act in ways that show they are thinking of what will cause the others to thrive. This kind of love especially includes forgiving others.
    * In the ULT, the word “love” refers to this kind of sacrificial love, unless a Translation Note indicates a different meaning.

2. Another word in the New Testament refers to brotherly love, or love for a friend or family member.

    * This term refers to natural human love between friends or relatives.
    * The term can also be used in such contexts as, “They love to sit in the most important seats at a banquet.” This means that they “like very much” or “greatly desire” to do that.

3. The word “love” can also refer to romantic love between a man and a woman.

## Translation Suggestions:

* Unless indicated otherwise in a Translation Note, the word “love” in the ULT refers to the kind of sacrificial love that comes from God.
* Some languages may have a special word for the kind of unselfish, sacrificial love that God has. Ways to translate this might include, “devoted, faithful caring” or “care for unselfishly” or “love from God.” Make sure that the word used to translate God’s love can include giving up one’s own interests to benefit others and loving others no matter what they do.
* Sometimes the English word “love” describes the deep caring that people have for friends and family members. Some languages might translate this with a word or phrase that means “like very much” or “care for” or “have strong affection for.”
* In contexts where the word “love” is used to express a strong preference for something, this could be translated by “strongly prefer” or “like very much” or “greatly desire.”
* Some languages may also have a separate word that refers to romantic or sexual love between a husband and wife.
* Many languages must express “love” as an action. So for example, they might translate “love is patient, love is kind” as, “when a person loves someone, he is patient with him and kind to him.”

(See also: [covenant](../kt/covenant.md), [death](../other/death.md), [sacrifice](../other/sacrifice.md), [save](../kt/save.md), [sin](../kt/sin.md))

## Bible References:

* [1 Corinthians 13:7](rc://en/tn/help/1co/13/07)
* [1 John 3:2](rc://en/tn/help/1jn/03/02)
* [1 Thessalonians 4:10](rc://en/tn/help/1th/04/10)
* [Galatians 5:23](rc://en/tn/help/gal/05/23)
* [Genesis 29:18](rc://en/tn/help/gen/29/18)
* [Isaiah 56:6](rc://en/tn/help/isa/56/06)
* [Jeremiah 2:2](rc://en/tn/help/jer/02/02)
* [John 3:16](rc://en/tn/help/jhn/03/16)
* [Matthew 10:37](rc://en/tn/help/mat/10/37)
* [Nehemiah 9:32-34](rc://en/tn/help/neh/09/32)
* [Philippians 1:9](rc://en/tn/help/php/01/09)
* [Song of Solomon 1:2](rc://en/tn/help/sng/01/02)

## Examples from the Bible stories:

* __[27:2](rc://en/tn/help/obs/27/02)__ The law expert replied that God’s law says, “__Love__ the Lord your God with all your heart, soul, strength, and mind. And __love__ your neighbor as yourself.”
* __[33:8](rc://en/tn/help/obs/33/08)__ “The thorny ground is a person who hears God’s word, but, as time passes, the cares, riches, and pleasures of life choke out his __love__ for God.”
* __[36:5](rc://en/tn/help/obs/36/05)__ As Peter was talking, a bright cloud came down on top of them and a voice from the cloud said, “This is my Son whom I __love__.”
* __[39:10](rc://en/tn/help/obs/39/10)__ “Everyone who __loves__ the truth listens to me.”
* __[47:1](rc://en/tn/help/obs/47/01)__ She (Lydia) __loved__ and worshiped God.
* __[48:1](rc://en/tn/help/obs/48/01)__ When God created the world, everything was perfect. There was no sin. Adam and Eve __loved__ each other, and they __loved__ God.
* __[49:3](rc://en/tn/help/obs/49/03)__ He (Jesus) taught that you need to __love__ other people the same way you love yourself.
* __[49:4](rc://en/tn/help/obs/49/04)__ He (Jesus) also taught that you need to __love__ God more than you __love__ anything else, including your wealth.
* __[49:7](rc://en/tn/help/obs/49/07)__ Jesus taught that God __loves__ sinners very much.
* __[49:9](rc://en/tn/help/obs/49/09)__ But God __loved__ everyone in the world so much that he gave his only Son so that whoever believes in Jesus will not be punished for his sins, but will live with God forever.
* __[49:13](rc://en/tn/help/obs/49/13)__ God __loves__ you and wants you to believe in Jesus so he can have a close relationship with you.

## Word Data:

* Strong’s: H157, H158, H159, H160, H2245, H2617, H2836, H3039, H4261, H5689, H5690, H5691, H7355, H7356, H7453, H7474, G25, G26, G5360, G5361, G5362, G5363, G5365, G5367, G5368, G5369, G5377, G5381, G5382, G5383, G5388

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
    doPinToolbar={false}
  />
</>
```
