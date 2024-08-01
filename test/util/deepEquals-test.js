import areDeepEquals from '../../client/scripts/util/deepEquals.js';
import referee from '@sinonjs/referee';
const { assert, refute } = referee;

describe('util:deepEquals', () => {
  describe('areDeepEquals', () => {
    it('should return true for two equal strings', () => {
      const test = 'hehe lol';
      assert(areDeepEquals(`${test}`, `${test}`));
    });

    it('should return false for object/null', () => {
      refute(areDeepEquals({ lol: 'hehe' }, null));
    });

    it('should return true for equal objects (unnested)', () => {
      const a = { hehe: 'lol', id: 2 };
      const b = { ...a };

      assert(areDeepEquals(a, b));
    });

    it('should return true for equal objects (unnested, with array)', () => {
      const a = { hehe: 'lol', lulz: [3, 5, 'lol'] };
      const b = Object.assign({}, a, { lulz: a.lulz.slice() });

      assert(areDeepEquals(a, b));
    });

    it('should return true for equal objects (nested)', () => {
      const c = { hehe: 'lol' };
      const a = { great: 'scott', c: { ...c } };
      const b = Object.assign({}, a, { c: { ...c } });

      assert(areDeepEquals(a, b));
    });

    it('should return false for unequal objects (unnested)', () => {
      const a = { hehe: 'lol', haha: 'rofl' };
      const b = { hehe: a.hehe };

      refute(areDeepEquals(a, b));
    });

    it('should return false for unequal objects (unnested, with unequal arrays)', () => {
      const a = { hehe: 'lol', haha: [1, 2, 3] };
      const b = { hehe: a.hehe, haha: [3, 2, 1] };

      refute(areDeepEquals(a, b));
    });

    it('should return false for unequal objects (nested)', () => {
      const a = { hehe: 'lol', haha: { rofl: 'lulz' } };
      const b = { hehe: a.hehe, haha: { lulz: 'rofl' } };

      refute(areDeepEquals(a, b));
    });
  });
});
