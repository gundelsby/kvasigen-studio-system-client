import { css } from '../../../util/syntax-helpers.js';

const styles = ({ r, g, b }) => css`
  :host {
    .name {
    }

    input[type='color' i] {
      border-radius: 50%;
      inline-size: 30px;
      block-size: 30px;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(${r}, ${g}, ${b});
      padding: 1px;
    }

    input[type='color' i]::-webkit-color-swatch-wrapper {
      padding: 1px;
    }

    input[type='color' i]::-webkit-color-swatch,
    input[type='color' i]::-moz-color-swatch {
      border-radius: 50%;
    }
  }
`;
/**
 * Generate styles based on parameter value
 *
 * @param {{r:number, g:number, b:number}} rgbValue
 * @returns
 */
export function getStyleTag(rgbValue) {
  const tag = document.createElement('style');
  tag.textContent = styles(rgbValue);
  return tag;
}
