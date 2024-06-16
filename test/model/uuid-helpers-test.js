import { isValidUuid } from '../../client/scripts/model/uuid-helpers.js';
import referee from '@sinonjs/referee';

const { assert, refute } = referee;

const UUID_VALID = '123e4567-e89b-12d3-a456-426614174000';

describe('model:uuid-helpers', () => {
  describe('isValidUuid', () => {
    it('should return true for a valid uuid', () => {
      assert(isValidUuid(UUID_VALID));
    });

    it('should return false for undefined', () => {
      refute(isValidUuid(undefined));
    });

    it('should return false for an empty string', () => {
      refute(isValidUuid(''));
    });

    it('should return false for a 35 character string', () => {
      const invalid = UUID_VALID.slice(0, -1);

      refute(isValidUuid(invalid));
    });

    it('should return false for a string not using hyphens as separators', () => {
      const invalid = UUID_VALID.replace('-', '_');

      refute(isValidUuid(invalid));
    });

    it('should return false for a string where one of the parts is not a valid hex value', () => {
      const invalid = UUID_VALID.slice(0, -1).concat('m');

      refute(isValidUuid(invalid));
    });
  });
});
