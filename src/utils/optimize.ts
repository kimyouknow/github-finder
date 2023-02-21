export const debounce = <T extends (...args: any[]) => void>(delay: number, callback: T) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => void>(delay: number, callback: T) => {
  let lastExecTime = 0;
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastExec = now - lastExecTime;

    if (timeSinceLastExec < delay) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastExecTime = now;
        callback.apply(this, args);
      }, delay - timeSinceLastExec);
    } else {
      lastExecTime = now;
      callback.apply(this, args);
    }
  };
};
