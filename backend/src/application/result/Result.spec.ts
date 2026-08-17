import { ok, err, isOk, isErr, flatMap, map } from './Result';

describe('Result (ROP)', () => {
  describe('ok()', () => {
    it('creates a success result with the given data', () => {
      const r = ok(42);
      expect(r.success).toBe(true);
      expect(r.data).toBe(42);
    });
  });

  describe('err()', () => {
    it('creates an error result with the given error', () => {
      const e = new Error('oops');
      const r = err(e);
      expect(r.success).toBe(false);
      expect(r.error).toBe(e);
    });
  });

  describe('isOk()', () => {
    it('returns true for an ok result', () => {
      expect(isOk(ok('value'))).toBe(true);
    });

    it('returns false for an err result', () => {
      expect(isOk(err(new Error()))).toBe(false);
    });
  });

  describe('isErr()', () => {
    it('returns true for an err result', () => {
      expect(isErr(err(new Error()))).toBe(true);
    });

    it('returns false for an ok result', () => {
      expect(isErr(ok('value'))).toBe(false);
    });
  });

  describe('flatMap()', () => {
    it('applies fn when result is ok', () => {
      const r = flatMap(ok(5), n => ok(n * 2));
      expect(isOk(r) && r.data).toBe(10);
    });

    it('propagates error without calling fn', () => {
      const fn = jest.fn();
      const e  = new Error('fail');
      const r  = flatMap(err(e), fn);
      expect(fn).not.toHaveBeenCalled();
      expect(isErr(r) && r.error).toBe(e);
    });
  });

  describe('map()', () => {
    it('transforms the ok value', () => {
      const r = map(ok(3), n => n + 1);
      expect(isOk(r) && r.data).toBe(4);
    });
  });
});
