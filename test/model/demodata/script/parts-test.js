import {
  createPartObject,
  isValidPart,
} from '../../../../client/scripts/model/demodata/script/parts.js';
import referee from '@sinonjs/referee';

const { assert, refute } = referee;

const FAKE_UUID_VALUE = '36b8f84d-df4e-4d49-b662-bcde71a8764f';

describe('model:demodata:script:parts', () => {
  // eslint-disable-next-line no-undef
  global.self = {
    crypto: {
      randomUUID: () => FAKE_UUID_VALUE,
    },
  };
  describe('isValidPart', () => {
    it('should return false for a string', () => {
      refute(isValidPart('lol'));
    });

    it('should return false for empty object', () => {
      refute(isValidPart({}));
    });

    it('should return false for an object with an invalid uuid', () => {
      const invalid = createPartObject();
      invalid.uuid = 'lol';

      refute(isValidPart(invalid));
    });

    it('should return true for a valid object', () => {
      assert(isValidPart(createPartObject()));
    });
  });

  describe('createPartObject', () => {
    it('should return a valid Part', () => {
      assert(isValidPart(createPartObject()));
    });
  });
});
