type BrowserStorageValue<T> = T extends string ? string : T;

const browserStorage = {
  set: <T extends string | unknown>(key: string, value: T) => {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  },
  get: <T extends string | unknown>(key: string) => {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    try {
      return JSON.parse(item) as BrowserStorageValue<T>;
    } catch {
      return item as BrowserStorageValue<T>;
    }
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

export default browserStorage;
