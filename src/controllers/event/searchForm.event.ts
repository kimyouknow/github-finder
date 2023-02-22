import { getGitHubUserProfile } from '@/apis';
import keywordStore, { Keyword } from '@/controllers/service/keywords';
import userProfileStore from '@/controllers/service/userProfile';
import { $ } from '@/utils/dom';
import { debounce } from '@/utils/optimize';
import { KeywordList, SearchAutoComplete } from '@/views/SearchForm';
import UserList from '@/views/UserList';

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  const $inputNickname = $<HTMLInputElement>('#inputNickname');
  const $searchAutoComplete = $<HTMLElement>('#searchAutoComplete');
  const $userList = $<HTMLElement>('#userList');
  await userProfileStore.requestUserProfile($inputNickname.value);
  $inputNickname.value = '';

  const userProfiles = userProfileStore.userProfiles;
  $userList.outerHTML = UserList(userProfiles);
  $searchAutoComplete.classList.toggle('display-none');
};

const handleAutoComplete = async () => {
  const $searchForm = $<HTMLElement>('#searchFormContainer');
  const $inputNickname = $<HTMLInputElement>('#inputNickname', $searchForm);
  let $searchAutoComplete = $<HTMLElement>('#searchAutoComplete', $searchForm);
  if ($inputNickname.value === '') {
    $searchAutoComplete.outerHTML = SearchAutoComplete();
    return;
  }
  const { items, total_count } = await getGitHubUserProfile($inputNickname.value, 10);
  const keywords: Keyword[] = items.map(({ id, login }) => ({ id, text: login, isActive: false }));
  $searchAutoComplete.outerHTML = SearchAutoComplete(keywords);
  keywordStore.getKeywords(keywords);
  // 다시 탐색해서 dom을 선택해야 outerHTML로 선택한 dom이 선택됨
  $searchAutoComplete = $<HTMLElement>('#searchAutoComplete', $searchForm);
  $searchAutoComplete.classList.toggle('display-none');
};

const handleSearchInput = debounce(1000, async () => {
  await handleAutoComplete();
});

const handleKeyDown = async (event: KeyboardEvent) => {
  const $searchAutoComplete = $<HTMLElement>('#searchAutoComplete');
  const $keywordList = $<HTMLElement>('#keywordList', $searchAutoComplete);
  const $inputNickname = $<HTMLInputElement>('#inputNickname');

  if (keywordStore.keywords.length === 0) return;

  const { key } = event;
  // TODO $inputNickname에 값이 있으면 자동 검색 , 없으면 최근 검색 기록 보여주기
  // TODO 활성화되어 있는 창에서 작동하도록 하기
  if (key === 'ArrowDown') {
    // Down arrow key pressed
    const activeKeyword = keywordStore.moveActive('down');

    $inputNickname.value = activeKeyword.text;
    $keywordList.outerHTML = KeywordList(keywordStore.keywords);
    return;
  }
  if (key === 'ArrowUp') {
    // Up arrow key pressed
    const activeKeyword = keywordStore.moveActive('up');
    $inputNickname.value = activeKeyword.text;
    $keywordList.outerHTML = KeywordList(keywordStore.keywords);
    return;
  }
};

const handleSearchFormEvent = () => {
  const $searchForm = $<HTMLElement>('#searchFormContainer');
  const $form = $<HTMLFormElement>('#searchForm', $searchForm);
  const $inputNickname = $<HTMLInputElement>('#inputNickname', $searchForm);

  $form.addEventListener('submit', handleSubmit);
  $inputNickname.addEventListener('input', handleSearchInput);
  $inputNickname.addEventListener('keydown', handleKeyDown);
};

export default handleSearchFormEvent;
