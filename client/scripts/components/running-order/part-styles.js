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
    display: inline-block;
    background-color: var(--bg-light);
    outline: solid var(--frame-light);
    padding: 4px;
  }
`;
