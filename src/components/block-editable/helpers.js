import {
  useCallback, useState, useEffect,
} from 'react';

export function useFixCursorOnNewLine(el) {
  const [savedSelection, setSavedSelection] = useState(null);

  const saveSelection = useCallback(function (containerEl) {
    if (window.getSelection().rangeCount > 0) {
      const range = window.getSelection().getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(containerEl);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const start = preSelectionRange.toString().length;

      /** Adding plus one to account for newline */
      setSavedSelection({
        start: start + 1,
        /** Adding plus one to account for newline */
        end: start + range.toString().length + 1,
      });
    } else {
      setSavedSelection({
        start: 0,
        end: 0,
      });
    }
  }, []);

  const restoreSelection = useCallback(function (containerEl, _savedSelection) {
    let charIndex = 0, range = document.createRange();
    range.setStart(containerEl, 0);
    range.collapse(true);
    let nodeStack = [containerEl], node, foundStart = false, stop = false;

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType == 3) {
        const nextCharIndex = charIndex + node.length;

        if (!foundStart && _savedSelection.start >= charIndex && _savedSelection.start <= nextCharIndex) {
          range.setStart(node, _savedSelection.start - charIndex);
          foundStart = true;
        }

        if (foundStart && _savedSelection.end >= charIndex && _savedSelection.end <= nextCharIndex) {
          range.setEnd(node, _savedSelection.end - charIndex);
          stop = true;
        }
        charIndex = nextCharIndex;
      } else {
        let i = node.childNodes.length;

        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  const handleRestore = useCallback((e) =>{
    /** Only listening for newline key character code */
    if (e.keyCode === 13) {
      restoreSelection(el, savedSelection);
    }
  }, [el, restoreSelection, savedSelection]);

  const handleSaveSelection = useCallback(() => {
    saveSelection(el);
  }, [el, saveSelection]);

  useEffect(() => {
    if (el) {
      el.addEventListener('keyup', handleRestore);
      el.addEventListener('keydown', handleSaveSelection);
    };
    return () => {
      if (el) {
        el.removeEventListener('keyup', handleRestore);
        el.addEventListener('keydown', handleSaveSelection);
      }
    };
  }, [el, handleRestore, handleSaveSelection, restoreSelection, saveSelection]);
}

export function useHandleUndo(el, initialState) {
  const [lastValues, setLastValues] = useState([initialState]);
  const handleUndo = useCallback((e) => {
    if (e.metaKey && e.key === 'z' && lastValues.length) {
      e.target.innerHTML = lastValues.pop();
    }

    if (!e.metaKey || (e.metaKey && e.key === 'v')) {
      const copy = lastValues.slice(0);
      copy.push(e.target.innerHTML);
      setLastValues(copy);
    }
  }, [lastValues]);

  useEffect(() => {
    if (el) {
      el.addEventListener('keydown', handleUndo);
    };
    return () => {
      if (el) {
        el.removeEventListener('keydown', handleUndo);
      }
    };
  }, [el, handleUndo]);
}

export function useHandlePaste(el, preview) {
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const doc = new DOMParser().parseFromString(pastedData, 'text/html');
    const text = doc.body.textContent || '';
    document.execCommand('insertHTML', false, text);
  }, []);

  useEffect(() => {
    if (el) {
      el.addEventListener('paste', handlePaste);
    };
    return () => {
      if (el) {
        el.removeEventListener('paste', handlePaste);
      }
    };
  }, [el, handlePaste, preview]);
}