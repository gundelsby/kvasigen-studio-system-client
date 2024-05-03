import referee from '@sinonjs/referee';
const { assert, refute } = referee;

describe('Test framework self tests', () => {
  it('should assert', () => {
    assert(true);
  });

  it('should refute', () => {
    refute(false);
  });
});
