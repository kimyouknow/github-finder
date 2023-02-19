export const debounce = <F extends (...args: any[]) => void>(callback: F, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback.apply(this, args)
    }, delay)
  }
}
