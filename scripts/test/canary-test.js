import { assert, refute } from '@sinonjs/referee';

describe('Test framework self tests', () => {
  it('should assert', () => {
    assert(true);
  });

  it('should refute', () => {
    refute(false);
  });
});
