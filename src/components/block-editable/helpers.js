export function formatTextOnPaste(id){
  const el = document.getElementById(id);

  function clear() {
    setTimeout(() => {
      const _el = document.getElementById(id);
      el.innerHTML=_el.innerText.trim();
    }, 1);
  }

  if (el) {
    el.addEventListener('paste', clear);
  }
  return () => {
    el.removeEventListener('paste');
  };
}