import referee from '@sinonjs/referee';
import {
  createPartParameterObject,
  isValidPartParameter,
  isValidPartParameterValue,
} from '../../../../../client/scripts/model/demodata/script/part-parameters.js';

const { assert, refute } = referee;

const FAKE_UUID_VALUE = '36b8f84d-df4e-4d49-b662-bcde71a8764f';
const FAKE_UUID_VALUE_ALT = '46b8f84d-df4e-4d49-b662-bcde71a8764e';

const validPartParameterData = {
  name: 'color',
  type: 'vec4',
  usedFor: 'whatever',
  canAutomate: true,
  values: [],
};

const validPartParameterValueData = {
  timecode: 1337,
  value: [0.1, 0.2, 0.3, 0.4],
};

describe('model:demodata:script:parts:part-parameters', () => {
  // eslint-disable-next-line no-undef
  global.self = {
    crypto: {
      randomUUID: () => FAKE_UUID_VALUE,
    },
  };
  describe('isValidPartParameter', () => {
    it('should return false for a string', () => {
      refute(isValidPartParameter('lol'));
    });

    it('should return false for empty object', () => {
      refute(isValidPartParameter({}));
    });

    it('should return false for an object with an invalid uuid', () => {
      const invalid = createPartParameterObject(validPartParameterData);
      invalid.uuid = 'lol';

      refute(isValidPartParameter(invalid));
    });

    it('should return false for an object without a name property', () => {
      const invalid = createPartParameterObject(validPartParameterData);
      delete invalid.name;

      refute(isValidPartParameter(invalid));
    });

    it('should return false for an object with a non-string name property', () => {
      const invalid = createPartParameterObject(validPartParameterData);
      invalid.name = ['lol'];

      refute(isValidPartParameter(invalid));
    });

    it('should return false for an object with an empty string name value', () => {
      const invalid = createPartParameterObject(validPartParameterData);
      invalid.name = '';

      refute(isValidPartParameter(invalid));
    });

    it('should return false for an object without a type property', () => {
      const invalid = createPartParameterObject(validPartParameterData);
      delete invalid.type;

      refute(isValidPartParameter(invalid));
    });

    it('should return false for an object with a non-string type property', () => {
      const invalid = createPartParameterObject(validPartParameterData);
      invalid.type = 13;

      refute(isValidPartParameter(invalid));
    });

    it('should return false for an object with an empty string type value', () => {
      const invalid = createPartParameterObject(validPartParameterData);
      invalid.type = '';

      refute(isValidPartParameter(invalid));
    });

    it('should return false for an object with a non-string usedFor property', () => {
      const invalid = createPartParameterObject(validPartParameterData);
      invalid.usedFor = false;

      refute(isValidPartParameter(invalid));
    });

    it('should return false for an object with an empty string usedFor value', () => {
      const invalid = createPartParameterObject(validPartParameterData);
      invalid.usedFor = '';

      refute(isValidPartParameter(invalid));
    });

    it('should return false for an object with a non-boolean canAutomate property', () => {
      const invalid = createPartParameterObject(validPartParameterData);
      invalid.canAutomate = 'false';

      refute(isValidPartParameter(invalid));
    });

    it('should return false for an object missing values array', () => {
      const invalid = createPartParameterObject(validPartParameterData);
      delete invalid.values;

      refute(isValidPartParameter(invalid));
    });

    it('should return true for a valid object', () => {
      assert(
        isValidPartParameter(createPartParameterObject(validPartParameterData)),
      );
    });
  });

  describe('isValidParameterValue', () => {
    it('should return false for a timecode with negative value', () => {
      const invalid = { ...validPartParameterValueData };
      invalid.timecode = -1;

      refute(isValidPartParameterValue(invalid));
    });
  });
});
