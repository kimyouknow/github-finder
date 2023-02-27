import { cloneDeep } from '@/utils';

export type Keyword = {
  id: number;
  text: string;
  isActive: boolean;
};
interface KeywordStore {
  keywords: Keyword[];
  getKeywords: () => Keyword[];
  setKeywords: (keywords: Keyword[]) => void;
  moveActive: (dr: 'up' | 'down') => Keyword;
}

const keywordStore: KeywordStore = {
  keywords: [],
  getKeywords() {
    return Object.freeze(cloneDeep(this.keywords)) as Keyword[];
  },
  setKeywords(keywords: Keyword[]) {
    this.keywords = cloneDeep(keywords);
  },
  moveActive(dr) {
    const activeIndex = this.keywords.findIndex(k => k.isActive);
    let nextIndex = dr === 'down' ? activeIndex + 1 : activeIndex - 1;
    const lastIndex = this.keywords.length - 1;

    if (nextIndex > lastIndex) {
      nextIndex = 0;
    }
    if (nextIndex < 0) {
      nextIndex = lastIndex;
    }

    this.keywords = this.keywords.map((k, i) => {
      const isActive = i === nextIndex;
      return { ...k, isActive };
    });
    return this.keywords[nextIndex];
  },
};

export default keywordStore;
