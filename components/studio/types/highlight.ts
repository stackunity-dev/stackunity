import hljs from 'highlight.js';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import { nextTick } from 'vue';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('vue', xml);

export const vueLanguage = hljs.getLanguage('xml');
if (vueLanguage) {
  vueLanguage.aliases = [...(vueLanguage.aliases || []), 'vue'];
}

export const highlightCode = (codeElement: HTMLElement, themeCodeElement: HTMLElement, codeTab: string) => {
  nextTick(() => {
    if (codeElement) {
      hljs.highlightElement(codeElement);
    }
    if (themeCodeElement) {
      hljs.highlightElement(themeCodeElement);
    }
    if (codeTab === 'template') {
      hljs.highlightElement(codeElement);
    } else if (codeTab === 'theme') {
      hljs.highlightElement(themeCodeElement);
    }
  });
};

export const highlightCodeFromSource = (source: string) => {
  const codeElement = document.createElement('code');
  codeElement.textContent = source;
  hljs.highlightElement(codeElement);
  return codeElement.textContent;
};

