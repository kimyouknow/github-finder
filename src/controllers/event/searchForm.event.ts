import keywordStore, { makeKeywordDtoList } from '@/controllers/service/keywords';
import userProfileStore from '@/controllers/service/userProfile';
import { $ } from '@/utils/dom';
import { debounce } from '@/utils/optimize';

import {
  toggleSearchAutoCompleteList,
  toggleSearchHistory,
  updateInput,
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

  toggleSearchAutoCompleteList();
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
    toggleSearchAutoCompleteList();
    toggleSearchHistory();
    return;
  }
  await handleAutoComplete(inputText);
  toggleSearchAutoCompleteList();
  toggleSearchHistory();
});

const handleKeyDownSearchInput = (event: KeyboardEvent) => {
  const $inputNickname = $<HTMLInputElement>('#inputNickname');
  const $keywordList = $<HTMLElement>('#keywordList');
  const keywordListType = $keywordList.getAttribute('data-keyword-type') as
    | 'autoComplete'
    | 'history';

  // $inputNickname에 값이 있으면 자동 검색 , 없으면 최근 검색 기록 보여주기
  const keywordStoreType = keywordListType === 'history' ? historyStore : autoCompleteListStore;
  const keywords = keywordStoreType.getKeywords();
  if (keywords.length === 0) return;

  const { key } = event;
  if (key === 'ArrowDown') {
    // Down arrow key pressed
    const activeKeyword = keywordStoreType.moveActive('down');
    const newKeywords = keywordStoreType.getKeywords();
    $inputNickname.value = activeKeyword.text;
    updateKeywordList(newKeywords, keywordListType);
    return;
  }
  if (key === 'ArrowUp') {
    // Up arrow key pressed
    const activeKeyword = keywordStoreType.moveActive('up');
    const newKeywords = keywordStoreType.getKeywords();
    $inputNickname.value = activeKeyword.text;
    updateKeywordList(newKeywords, keywordListType);
    return;
  }
};

const handleClickSearchInput = (event: Event) => {
  // 로컬스토리에서 검색 목록 가져오기
  const textInput = (event.currentTarget as HTMLInputElement).value;
  if (textInput !== '') {
    return;
  }
  const keywords = historyStore.getFormStorage();

  if (!keywords) {
    // 없으면 빈 화면 렌더링
    updateSearchHistory();
  } else {
    // 있으면 업데이트 후 렌더링
    updateSearchHistory(keywords);
  }

  toggleSearchHistory();
};

const handleSearchFormEvent = () => {
  const $searchForm = $<HTMLElement>('#searchFormContainer');
  const $form = $<HTMLFormElement>('#searchForm', $searchForm);
  const $searchInput = $<HTMLInputElement>('#inputNickname', $searchForm);

  $form.addEventListener('submit', handleSubmit);
  $searchInput.addEventListener('input', handleSearchInput);
  $searchInput.addEventListener('keydown', handleKeyDownSearchInput);
  $searchInput.addEventListener('click', handleClickSearchInput);
};

export default handleSearchFormEvent;
