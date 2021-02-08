export const filter = ({ string, filters }) => {
  debugger;

  let _string = (string || '').slice(0);

  if (_string.includes("εὐσέβειαν"))
  {
    alert("string.ts 1 : εὐσέβειαν! [ " + _string.length);
  }
  if (_string.includes("εὐσέβειαν") && _string.includes("\u200B"))
  {
    alert("string.ts 1 : εὐσέβειαν! and NBSP ");
  }

  if (filters)
  {
    filters.forEach((filter) => {
      const [replace, replacer] = filter;
      _string = _string.replace(replace, replacer);
    });
  }

  if (_string.includes("εὐσέβειαν"))
  {
    alert("string.ts 2 : εὐσέβειαν! [ " + _string.length);
  }
  if (_string.includes("εὐσέβειαν") && _string.includes("\u200B"))
  {
    alert("string.ts 2 : εὐσέβειαν! and NBSP ");
  }

  return _string;
};

export const isHebrew = (string) => {
  const hebrewChars = string.match(/[\u0590-\u05FF]/g) || [];
  const percent = hebrewChars.length / string.length;
  return percent > 0.75;
};