import { cloneDeep } from '@/utils';

import { UserProfile } from './userProfile';

export type Keyword = {
  id: number;
  text: string;
  isActive: boolean;
};

export const makeKeywordDto = (userProfiles: UserProfile[]): Keyword[] =>
  userProfiles.map(({ id, nickname }) => ({
    id,
    text: nickname,
    isActive: false,
  }));

interface KeywordState {
  keywords: Keyword[];
}

const KeyWord = () => {
  const state: KeywordState = {
    keywords: [],
  };
  return {
    getKeywords() {
      return cloneDeep(state.keywords);
    },
    setKeywords(keywords: Keyword[]) {
      state.keywords = cloneDeep(keywords);
    },
    moveActive(dr: 'up' | 'down') {
      const activeIndex = state.keywords.findIndex(k => k.isActive);
      let nextIndex = dr === 'down' ? activeIndex + 1 : activeIndex - 1;
      const lastIndex = state.keywords.length - 1;

      if (nextIndex > lastIndex) {
        nextIndex = 0;
      }
      if (nextIndex < 0) {
        nextIndex = lastIndex;
      }

      state.keywords = state.keywords.map((k, i) => {
        const isActive = i === nextIndex;
        return { ...k, isActive };
      });
      return state.keywords[nextIndex];
    },
  };
};

const keywordStore = KeyWord();

export default keywordStore;
