// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const cloneDeep = <T>(x: T): T => JSON.parse(JSON.stringify(x));

type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Months
 */
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;
/**
 * Days
 */
type DD = `${0}${oneToNine}` | `${1 | 2}${zeroToNine}` | `3${0 | 1}`;

/**
 * MMDD
 */
export type DateMMDD = `${MM}.${DD}.`;

export const formatDateToMMDD = (d: Date | string): DateMMDD => {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }) as DateMMDD;
};

type CallbackFn<T> = (arg: T) => T;

export const go = <T>(item: T, ...args: CallbackFn<T>[]) =>
  args.reduce((a: T, callback: CallbackFn<T>) => callback(a), item);

export const removeDuplicatesByKey = <T, K extends keyof T>(items: T[], key: K) => {
  const filteredItems: T[] = [];
  const valueSet = new Set<T[K]>();
  for (const item of items) {
    if (!valueSet.has(item[key])) {
      filteredItems.push(item);
      valueSet.add(item[key]);
    }
  }
  return filteredItems;
};
