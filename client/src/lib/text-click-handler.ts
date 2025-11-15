import { ttsService } from './tts-service';

class TextClickHandler {
  private isInitialized = false;
  private clickedElement: HTMLElement | null = null;
  private originalBackground: string = '';
  private highlightTimeout: number | null = null;

  // Elements that should NOT trigger TTS
  private readonly skipSelectors = [
    'button',
    'input',
    'textarea', 
    'select',
    'a',
    '[role="button"]',
    '[role="link"]',
    '[contenteditable="true"]',
    '.skip-tts',
    // Interactive elements
    '[onclick]',
    '[onmousedown]',
    '[onmouseup]',
    // Form elements
    'form',
    'fieldset',
    'legend'
  ];

  // Elements that are good candidates for TTS
  private readonly textSelectors = [
    'p',
    'span',
    'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'li',
    'td',
    'th',
    'label',
    'blockquote',
    'figcaption',
    'caption',
    'dt',
    'dd'
  ];

  initialize(): void {
    if (this.isInitialized) return;

    document.addEventListener('click', this.handleClick.bind(this), {
      capture: true,
      passive: true
    });

    this.isInitialized = true;
  }

  private handleClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    if (!target || !ttsService.isEnabled()) {
      return;
    }

    // Skip if target or any parent should be ignored
    if (this.shouldSkipElement(target)) {
      return;
    }

    // Find the best text element to speak from
    const textElement = this.findTextElement(target);
    if (!textElement) return;

    // Extract and clean text
    const text = this.extractText(textElement);
    if (!text) return;

    // Provide visual feedback
    this.highlightElement(textElement);

    // Speak the text
    ttsService.speak(text);

    // Prevent the click from doing its normal action for text elements
    if (this.isTextOnlyElement(textElement)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private shouldSkipElement(element: HTMLElement): boolean {
    // Check if element or any parent matches skip selectors
    let current: HTMLElement | null = element;
    
    while (current && current !== document.body) {
      // Check tag name and attributes
      const tagName = current.tagName.toLowerCase();
      const hasClickHandler = current.onclick !== null || 
                             current.hasAttribute('onclick') ||
                             current.hasAttribute('role');
      
      // Skip if it's an interactive element
      if (this.skipSelectors.some(selector => {
        if (selector.startsWith('[') && selector.endsWith(']')) {
          const attr = selector.slice(1, -1);
          if (attr.includes('=')) {
            const [attrName, attrValue] = attr.split('=');
            return current!.getAttribute(attrName.trim()) === attrValue.replace(/"/g, '').trim();
          }
          return current!.hasAttribute(attr);
        }
        return current!.matches(selector);
      })) {
        return true;
      }

      // Skip if element has click handlers (likely interactive)
      if (hasClickHandler && tagName !== 'div' && tagName !== 'span') {
        return true;
      }

      // Skip if it's a button-like element
      if (current.getAttribute('role') === 'button' || 
          current.getAttribute('role') === 'link' ||
          current.classList.contains('cursor-pointer')) {
        return true;
      }

      current = current.parentElement;
    }

    return false;
  }

  private findTextElement(target: HTMLElement): HTMLElement | null {
    let current: HTMLElement | null = target;

    // First, try to find a good text container moving up the DOM
    while (current && current !== document.body) {
      if (this.hasReadableText(current)) {
        return current;
      }
      current = current.parentElement;
    }

    // If no good parent found, use the original target if it has text
    if (this.hasReadableText(target)) {
      return target;
    }

    return null;
  }

  private hasReadableText(element: HTMLElement): boolean {
    const text = this.extractText(element);
    return text.length >= 3 && text.length <= 500; // Reasonable text length
  }

  private extractText(element: HTMLElement): string {
    // Try different methods to get meaningful text
    let text = '';

    // 1. Try aria-label first (for accessibility)
    text = element.getAttribute('aria-label') || '';
    if (text.trim().length > 3) return this.cleanText(text);

    // 2. Try title attribute
    text = element.getAttribute('title') || '';
    if (text.trim().length > 3) return this.cleanText(text);

    // 3. Get direct text content (not from children)
    text = this.getDirectTextContent(element);
    if (text.trim().length > 3) return this.cleanText(text);

    // 4. Get all text content as fallback
    text = element.textContent || '';
    return this.cleanText(text);
  }

  private getDirectTextContent(element: HTMLElement): string {
    let text = '';
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || '';
      }
    }
    return text.trim();
  }

  private cleanText(text: string): string {
    return text
      .trim()
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove very short or very long text
      .substring(0, 500)
      // Remove empty or meaningless text
      .replace(/^[\s\-_.,:;!?]+$/, '')
      .trim();
  }

  private isTextOnlyElement(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase();
    return ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName) &&
           !element.onclick &&
           !element.hasAttribute('onclick') &&
           !element.getAttribute('role');
  }

  private highlightElement(element: HTMLElement): void {
    // Clear any existing highlight
    this.clearHighlight();

    // Store original background
    this.clickedElement = element;
    this.originalBackground = element.style.backgroundColor || '';

    // Apply subtle highlight
    element.style.backgroundColor = 'rgba(69, 157, 239, 0.1)'; // Using your brand color
    element.style.transition = 'background-color 0.2s ease';

    // Remove highlight after speech or timeout
    this.highlightTimeout = window.setTimeout(() => {
      this.clearHighlight();
    }, 3000);
  }

  private clearHighlight(): void {
    if (this.clickedElement) {
      this.clickedElement.style.backgroundColor = this.originalBackground;
      this.clickedElement = null;
    }
    
    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
      this.highlightTimeout = null;
    }
  }

  destroy(): void {
    if (this.isInitialized) {
      document.removeEventListener('click', this.handleClick.bind(this), {
        capture: true
      });
      this.clearHighlight();
      this.isInitialized = false;
    }
  }
}

export const textClickHandler = new TextClickHandler();