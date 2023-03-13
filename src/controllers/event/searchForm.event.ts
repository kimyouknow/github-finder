import keywordStore, { makeKeywordDtoList } from '@/controllers/service/keywords';
import userProfileStore from '@/controllers/service/userProfile';
import { $ } from '@/utils/dom';
import { debounce } from '@/utils/optimize';

import {
  hideAutoCompleteList,
  hideSearchHistory,
  showAutoCompleteList,
  showSearchHistory,
  updateInput,
  updateInputText,
  updateKeywordList,
  updateSearchAutoCompleteList,
  updateSearchHistory,
  updateUserProfileList,
} from './searchForm.updateView';

const { autoCompleteListStore, historyStore } = keywordStore;

// Event Handler

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  const $inputNickname = $<HTMLInputElement>('#inputNickname');
  const inputText = $inputNickname.value;
  await userProfileStore.requestUserProfile(inputText);

  updateInput();

  historyStore.addKeyword(inputText);

  const userProfiles = userProfileStore.getUserProfiles();
  updateUserProfileList(userProfiles);

  hideSearchHistory();
  hideAutoCompleteList();
};

const handleAutoComplete = async (inputText: string) => {
  await userProfileStore.requestUserProfile(inputText);
  // 요청한 30개 중 10개만 사용하기
  const keywords = makeKeywordDtoList(userProfileStore.getUserProfiles().slice(10));
  autoCompleteListStore.setKeywords(keywords);
  updateSearchAutoCompleteList(keywords);
};

const handleSearchInput = debounce(1000, async () => {
  const $inputNickname = $<HTMLInputElement>('#inputNickname');
  const inputText = $inputNickname.value;
  if (inputText === '') {
    const keywords = historyStore.getKeywords();
    updateSearchHistory(keywords);
    showSearchHistory();
    hideAutoCompleteList();
    return;
  }

  await handleAutoComplete(inputText);
  showAutoCompleteList();
  hideSearchHistory();
});

const handleKeyDownSearchInput = (event: KeyboardEvent) => {
  const $inputNickname = $<HTMLInputElement>('#inputNickname');
  const $searchAutoComplete = $<HTMLElement>('#searchAutoComplete');
  const $searchHistory = $<HTMLElement>('#searchHistory');

  const $activeList = $searchAutoComplete.classList.contains('display-none')
    ? $searchHistory
    : $searchAutoComplete;

  const $keywordList = $<HTMLUListElement>('#keywordList', $activeList);

  const keywordListType = $keywordList.getAttribute('data-keyword-type') as
    | 'autoComplete'
    | 'history';

  const keywordStoreType = keywordListType === 'history' ? historyStore : autoCompleteListStore;
  const keywords = keywordStoreType.getKeywords();

  if ($inputNickname.value === '') {
    updateSearchHistory(keywords || []);
    showSearchHistory();
  }

  const { key } = event;
  if (key === 'ArrowDown') {
    // Down arrow key pressed
    const activeKeyword = keywordStoreType.moveActive('down');
    const newKeywords = keywordStoreType.getKeywords();
    updateKeywordList(newKeywords, keywordListType);
    updateInputText(activeKeyword.text);
    return;
  }
  if (key === 'ArrowUp') {
    event.preventDefault();
    // Up arrow key pressed
    const activeKeyword = keywordStoreType.moveActive('up');
    const newKeywords = keywordStoreType.getKeywords();
    updateKeywordList(newKeywords, keywordListType);
    updateInputText(activeKeyword.text);
    return;
  }
};

const handleClickSearchInput = () => {
  // 로컬스토리에서 검색 목록 가져오기
  const keywords = historyStore.getFormStorage();

  updateSearchHistory(keywords || []);

  hideAutoCompleteList();
  showSearchHistory();
};

const handleClickOutside = (event: Event) => {
  const $searchForm = $<HTMLElement>('#searchFormContainer');
  const isClickSearchForm = event.composedPath().includes($searchForm);
  if (!isClickSearchForm) {
    hideSearchHistory();
    hideAutoCompleteList();
  }
};

const handleClickDeleteAllButton = (event: Event) => {
  historyStore.removeAll();
  updateKeywordList([], 'history');
};

const bindEventToChildren = (event: Event) => {
  const $deleteAllButton = $<HTMLButtonElement>('#searchHistoryDeleteAll');
  if (event.target === $deleteAllButton) {
    handleClickDeleteAllButton(event);
  }
};

const handleSearchFormEvent = () => {
  const $searchForm = $<HTMLElement>('#searchFormContainer');
  const $form = $<HTMLFormElement>('#searchForm', $searchForm);
  const $searchInput = $<HTMLInputElement>('#inputNickname', $searchForm);

  $searchForm.addEventListener('click', bindEventToChildren);
  $form.addEventListener('submit', handleSubmit);
  $searchInput.addEventListener('input', handleSearchInput);
  $searchInput.addEventListener('keydown', handleKeyDownSearchInput);
  $searchInput.addEventListener('click', handleClickSearchInput);
  window.addEventListener('click', handleClickOutside);
};

export default handleSearchFormEvent;
