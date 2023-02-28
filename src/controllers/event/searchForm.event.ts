import keywordStore, { makeKeywordDto } from '@/controllers/service/keywords';
import userProfileStore from '@/controllers/service/userProfile';
import { $ } from '@/utils/dom';
import { debounce } from '@/utils/optimize';

import {
  toggleSearchAutoCompleteList,
  updateInput,
  updateKeywordList,
  updateSearchAutoCompleteList,
  updateUserProfileList,
} from './searchForm.updateView';

const { autoCompleteListStore, historyStore } = keywordStore;

// Event Handler

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  const $inputNickname = $<HTMLInputElement>('#inputNickname');
  await userProfileStore.requestUserProfile($inputNickname.value);
  updateInput();

  const userProfiles = userProfileStore.getUserProfiles();
  updateUserProfileList(userProfiles);
  toggleSearchAutoCompleteList();
};

const handleAutoComplete = async () => {
  const $searchForm = $<HTMLElement>('#searchFormContainer');
  const $inputNickname = $<HTMLInputElement>('#inputNickname', $searchForm);
  if ($inputNickname.value === '') {
    updateSearchAutoCompleteList();
    return;
  }
  await userProfileStore.requestUserProfile($inputNickname.value);
  // 요청한 30개 중 10개만 사용하기
  const keywords = makeKeywordDto(userProfileStore.getUserProfiles().slice(10));
  autoCompleteListStore.setKeywords(keywords);
  updateSearchAutoCompleteList(keywords);
};

const handleSearchInput = debounce(1000, async () => {
  await handleAutoComplete();
  toggleSearchAutoCompleteList();
});

const handleKeyDownSearchInput = (event: KeyboardEvent) => {
  const $inputNickname = $<HTMLInputElement>('#inputNickname');
  const keywords = autoCompleteListStore.getKeywords();
  if (keywords.length === 0) return;

  const { key } = event;
  // TODO $inputNickname에 값이 있으면 자동 검색 , 없으면 최근 검색 기록 보여주기
  // TODO 활성화되어 있는 창에서 작동하도록 하기
  if (key === 'ArrowDown') {
    // Down arrow key pressed
    const activeKeyword = autoCompleteListStore.moveActive('down');
    $inputNickname.value = activeKeyword.text;
    updateKeywordList(keywords);
    return;
  }
  if (key === 'ArrowUp') {
    // Up arrow key pressed
    const activeKeyword = autoCompleteListStore.moveActive('up');
    $inputNickname.value = activeKeyword.text;
    updateKeywordList(keywords);
    return;
  }
};

const handleClickSearchInput = (event: Event) => {
  console.log('event.target.value', event.currentTarget);
  // 로컬스토리에서 검색 목록 가져오기
  // 없으면 빈 화면 렌더링

  // 있으면 업데이트 후 렌더링
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
