import debounce from '../src/utils/debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('defers execution until the wait elapses', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced('a');
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('a');
  });

  test('collapses rapid calls into a single trailing invocation', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced('first');
    jest.advanceTimersByTime(50);
    debounced('second');
    jest.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('second');
  });

  test('passes through multiple arguments', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 10);

    debounced(1, 'two', { three: 3 });
    jest.advanceTimersByTime(10);

    expect(fn).toHaveBeenCalledWith(1, 'two', { three: 3 });
  });

  test('cancel prevents the pending invocation', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced('x');
    debounced.cancel();
    jest.advanceTimersByTime(500);

    expect(fn).not.toHaveBeenCalled();
  });

  test('a cancelled debounce can be re-armed', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced('first');
    debounced.cancel();
    debounced('second');
    jest.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('second');
  });
});
