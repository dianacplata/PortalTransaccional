export type Ok<T> = { readonly success: true; readonly data: T };
export type Err<E> = { readonly success: false; readonly error: E };
export type Result<T, E = Error> = Ok<T> | Err<E>;

export const ok = <T>(data: T): Ok<T> => ({ success: true, data });
export const err = <E>(e: E): Err<E> => ({ success: false, error: e });

export const isOk = <T, E>(r: Result<T, E>): r is Ok<T> => r.success === true;
export const isErr = <T, E>(r: Result<T, E>): r is Err<E> => r.success === false;

/** Encadenamiento de operaciones — flatMap / bind */
export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> => (isOk(result) ? fn(result.data) : result);

/** Transforma el valor Ok sin afectar el Err */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> => (isOk(result) ? ok(fn(result.data)) : result);
