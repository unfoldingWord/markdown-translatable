export const filter = ({ string, filters }) => {
  let _string = (string || '').slice(0);

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

function getCaretPosition(editableDiv) {
  let caretPos = 0,
    sel,
    range;

  if (window.getSelection) {
    sel = window.getSelection();

    if (sel.rangeCount) {
      range = sel.getRangeAt(0);

      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();

    if (range.parentElement() == editableDiv) {
      const tempEl = document.createElement('span');
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      const tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint('EndToEnd', range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}

export const getCursorReset = (e) => {
  const el = e.target;
  const position = getCaretPosition(el);

  return () => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(el.childNodes[0], 10);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  };
};
