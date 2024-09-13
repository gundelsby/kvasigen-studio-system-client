import getLogger from '../../util/logger.js';

export { addNewOrderedElements, removeElements, reorderElements };

const logger = getLogger('components:util:elementListHelpers');

/**
 * Removes all from the given root element container that has
 * a data-uuid attribute with a value corresponding to an entry in the provided
 * list of uuids.
 *
 * @param {Set<string>} uuids - a list of uuids identifying elements to remove
 * @param {HTMLElement} rootElement - the HTMLElement containing these elements
 */
function removeElements(uuids, rootElement) {
  logger.log(`Removing parts...`, { uuids });
  for (const uuid of uuids) {
    const partElement = rootElement.querySelector(`[data-uuid="${uuid}]"`);
    if (partElement) {
      partElement.remove();
      logger.success(`Removed element for ${uuid}`);
    } else {
      logger.warn(`Unable to find element for ${uuid}, not removed`);
    }
  }
}

/**
 * Creates and inserts elements from the provided list of new element uuids
 * using the provided tag name, respecting the order from the provided full list
 * of elements.
 *
 * This function will use the data-uuid attribute for lookups when deciding where
 * to insert the new elements, assuming the provided root element to be the
 * direct parent of both existing and new elements
 *
 * The tag resolver function will not be used if a tag name is explicitly given
 *
 * @param {Set<string>} newElementUuids - a list of the uuids for the new elements to create
 * @param {string[]} allElementUuids - a complete ordered list of both new and existing elements
 * @param {HTMLElement} rootElement - the direct parent element containing the element list
 * @param {string|null|undefined} [tagName] - tag name to use when creating new elements, or a function to resolve the tag name based on uuid
 * @param {function} [tagNameResolver] - resolver function to determine tag name dynamically based on uuid
 */
function addNewOrderedElements(
  newElementUuids,
  allElementUuids,
  rootElement,
  tagName,
  tagNameResolver,
) {
  // create elements for new parts
  const newPartElements = [];

  //TODO: this is an uncessary loop, elements can be created on the fly
  for (const uuid of newElementUuids) {
    const resolvedTagName = tagName
      ? tagName
      : typeof tagNameResolver === 'function' && tagNameResolver(uuid);

    if (!resolvedTagName) {
      logger.warn(`Tag name for ${uuid} could not be resolved, skipping`, {
        tagName,
        tagNameResolver,
      });
      continue;
    }

    const partElement = document.createElement(resolvedTagName);
    partElement.dataset.uuid = uuid;
    newPartElements.push(partElement);
  }

  // insert the new HTML elements using order from parts
  for (let i = 0; i < allElementUuids.length; i++) {
    const uuid = allElementUuids[i];
    const newPartElement = newPartElements.find((p) => p.dataset.uuid === uuid);
    //TODO: check uuid list instead and create element if necessary or continue if not
    if (!newPartElement) {
      // not a new element, nothing to do here
      continue;
    }

    if (i === 0) {
      // this is the new first part
      rootElement.prepend(newPartElement);
      logger.success(`Inserted element ${uuid}`);
    } else {
      const previousUuid = allElementUuids[i - 1];
      const elementToInsertAfter = rootElement.querySelector(
        `[data-uuid="${previousUuid}"]`,
      );
      if (!elementToInsertAfter) {
        logger.error(
          `Unable to insert new element ${uuid}, because the element before it (uuid: ${previousUuid}) can't be found `,
        );
        continue;
      }

      rootElement.insertBefore(
        newPartElement,
        elementToInsertAfter.nextSibling,
      );
      logger.success(`Inserted new element ${uuid}`);
    }
  }
}

function reorderElements() {
  //TODO: implement
}
