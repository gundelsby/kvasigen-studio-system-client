import { tagName as colorParamTagName } from './parameters/color-parameter.js';
import { tagName as genericParamTagName } from './parameters/generic-parameter.js';
import { getPartParameter } from '../../api/demodata/script/part-parameters.js';

/**
 * Decides and returns the appropriate element name for the part parameter
 * defined by the given uuid
 *
 * @param {import("../../model/demodata/script/parts.js").PartParameter} uuid - parameter to create element for
 * @returns {string}
 */
export default function getTagNameForPartParameter(uuid) {
  const parameter = getPartParameter(uuid);

  if (!parameter) {
    return null;
  }

  switch (parameter.usedFor) {
    case 'color':
      return colorParamTagName;
    default:
      return genericParamTagName;
  }
}
