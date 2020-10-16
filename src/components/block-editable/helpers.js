import {
  useCallback, useState, useEffect,
} from 'react';

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