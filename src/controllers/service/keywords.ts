import { cloneDeep, DateMMDD, formatDateToMMDD, go, removeDuplicatesByKey } from '@/utils';
import browserStorage from '@/utils/browser';

import { UserProfile } from './userProfile';

export type Keyword = {
  id: number;
  text: string;
  isActive: boolean;
  searchAt: DateMMDD;
};

export const makeKeywordDto = (text: string, id: number = new Date().valueOf()): Keyword => ({
  id,
  text,
  isActive: false,
  searchAt: formatDateToMMDD(new Date()),
});

export const makeKeywordDtoList = (userProfiles: UserProfile[]): Keyword[] =>
  userProfiles.map(({ id, nickname }) => makeKeywordDto(nickname, id));

interface KeywordState {
  keywords: Keyword[];
}

const KeyWord = (initKeywords: Keyword[]) => {
  const state: KeywordState = {
    keywords: initKeywords,
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

const HistoryKeyWord = (initKeywords: Keyword[], storageKey: string) => {
  const keywordManager = KeyWord(initKeywords);

  const saveToStorage = (keywords: Keyword[]) => {
    browserStorage.set(storageKey, keywords);
  };
  return {
    ...keywordManager,
    getFormStorage() {
      const keywords = browserStorage.get<Keyword[]>(storageKey);
      if (keywords !== null) {
        keywordManager.setKeywords(keywords);
        return keywordManager.getKeywords();
      }
      return null;
    },
    addKeyword(text: string) {
      const keywords = keywordManager.getKeywords();
      const newKeyword = makeKeywordDto(text);
      const newKeywords = go(
        [newKeyword, ...keywords],
        keywords => removeDuplicatesByKey(keywords, 'id'),
        keywords => removeDuplicatesByKey(keywords, 'text'),
      );
      keywordManager.setKeywords(newKeywords);
      saveToStorage(newKeywords);
    },
    removeAll() {
      browserStorage.remove(storageKey);
      keywordManager.setKeywords([]);
    },
  };
};

const autoCompleteListStore = KeyWord([]);
const historyStore = HistoryKeyWord([], 'history-keywords');

export default {
  autoCompleteListStore,
  historyStore,
};
