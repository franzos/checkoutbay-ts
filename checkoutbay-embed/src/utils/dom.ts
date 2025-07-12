/**
 * DOM utility functions
 */

export function createElement(tag: string, className: string = '', attributes: Record<string, any> = {}): HTMLElement {
  const element = document.createElement(tag);
  
  if (className) {
    element.className = className;
  }
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else {
      (element as any)[key] = value;
    }
  });
  
  return element;
}

export function findElements(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(selector)) as HTMLElement[];
}

export function findElement(selector: string): HTMLElement | null {
  return document.querySelector(selector) as HTMLElement | null;
}

export function injectStyles(css: string): HTMLStyleElement {
  const style = createElement('style', '', {
    innerHTML: css
  }) as HTMLStyleElement;
  document.head.appendChild(style);
  return style;
}

export function getDataAttribute(element: HTMLElement, attribute: string, defaultValue: string = ''): string {
  const value = element.getAttribute(`data-${attribute}`);
  return value || defaultValue;
}

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: number;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}