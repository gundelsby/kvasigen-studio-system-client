import { css } from '../../util/syntax-helpers.js';

/**
 * Get styles for the layer component as a style tag element
 *
 * @returns {HTMLStyleElement}
 */
export default function getStyleTag() {
  const tag = document.createElement('style');
  tag.textContent = styles;
  return tag;
}

const styles = css`
  :host {
    background: var(--bg-light);
    display: block;
    max-height: 25%;
    min-height: 400px;
  }
`;
