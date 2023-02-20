export interface LocalStorage {
  set: <T extends string>(key: string, value: T) => void;
  get: (key: string) => string | null;
  remove: (key: string) => void;
  reset: () => void;
}

const localStorageUtils: LocalStorage = {
  set: (key, value) => {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  get: key => {
    return localStorage.getItem(key) || null;
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
  reset: () => {
    localStorage.clear();
  },
};

export default localStorageUtils;
