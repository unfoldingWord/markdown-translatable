export * from './markdown';

export const filter = ({ string, filters }) => {
  let _string = string.slice(0);
  filters.forEach((filter) => {
    const [replace, replacer] = filter;
    _string = _string.replace(replace, replacer);
  });
  return _string;
};

export const isHebrew = (string) => {
  const hebrewChars = string.match(/[\u0590-\u05FF]/g) || [];
  const percent = hebrewChars.length / string.length;
  return percent > 0.75;
};