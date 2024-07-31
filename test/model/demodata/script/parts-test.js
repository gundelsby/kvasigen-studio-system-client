import {
  createPartObject,
  isValidPart,
} from '../../../../client/scripts/model/demodata/script/parts.js';
import referee from '@sinonjs/referee';

const { assert, refute } = referee;

const FAKE_UUID_VALUE = '36b8f84d-df4e-4d49-b662-bcde71a8764f';
const FAKE_UUID_VALUE_ALT = '46b8f84d-df4e-4d49-b662-bcde71a8764e';

const validPartData = {
  id: 'klovnese',
  layer: FAKE_UUID_VALUE_ALT,
  parameters: [],
  startsAt: 0,
  endsAt: 5000,
};

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
      const invalid = createPartObject(validPartData);
      invalid.uuid = 'lol';

      refute(isValidPart(invalid));
    });

    it('should return false for an object missing parameters array', () => {
      const invalid = createPartObject(validPartData);
      delete invalid.parameters;

      refute(isValidPart(invalid));
    });

    it('should return true for a valid object', () => {
      assert(isValidPart(createPartObject(validPartData)));
    });
  });

  describe('createPartObject', () => {
    it('should return a valid Part for valid data', () => {
      const valid = createPartObject(validPartData);

      assert(isValidPart(valid));
    });

    it('should create a uuid for the new part', () => {
      // eslint-disable-next-line no-undef
      const expected = global.self.crypto.randomUUID();
      const part = createPartObject(validPartData);

      assert.equals(expected, part.uuid);
    });
  });
});
