import keywordStore, { Keyword } from '@/controllers/service/keywords';
import userProfileStore, { UserProfile } from '@/controllers/service/userProfile';
import { $, render } from '@/utils/dom';
import { debounce } from '@/utils/optimize';
import { KeywordList, SearchAutoComplete } from '@/views/SearchForm';
import UserList from '@/views/UserList';

// Update View

const updateInput = (text?: string) => {
  const $inputNickname = $<HTMLInputElement>('#inputNickname');
  $inputNickname.value = text || '';
};

const updateUserProfileList = (userProfiles: UserProfile[]) => {
  const $userList = $<HTMLElement>('#userList');
  render($userList, UserList, userProfiles);
};

const updateSearchAutoCompleteList = (keywords?: Keyword[]) => {
  const $searchAutoComplete = $<HTMLElement>('#searchAutoComplete');
  render($searchAutoComplete, SearchAutoComplete, keywords);
};

const toggleSearchAutoCompleteList = () => {
  const $searchAutoComplete = $<HTMLElement>('#searchAutoComplete');
  $searchAutoComplete.classList.toggle('display-none');
};

const updateKeywordList = (keywords: Keyword[]) => {
  const $keywordList = $<HTMLElement>('#keywordList');
  render($keywordList, KeywordList, keywords);
};

// Event Handler

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  const $inputNickname = $<HTMLInputElement>('#inputNickname');
  await userProfileStore.requestUserProfile($inputNickname.value);
  updateInput();

  const userProfiles = userProfileStore.userProfiles;
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
  const keywords: Keyword[] = userProfileStore.userProfiles.map(({ id, nickname }) => ({
    id,
    text: nickname,
    isActive: false,
  }));
  keywordStore.setKeywords(keywords);
  updateSearchAutoCompleteList(keywords);
};

const handleSearchInput = debounce(1000, async () => {
  await handleAutoComplete();
  toggleSearchAutoCompleteList();
});

const handleKeyDown = (event: KeyboardEvent) => {
  const $inputNickname = $<HTMLInputElement>('#inputNickname');

  if (keywordStore.keywords.length === 0) return;

  const { key } = event;
  // TODO $inputNickname에 값이 있으면 자동 검색 , 없으면 최근 검색 기록 보여주기
  // TODO 활성화되어 있는 창에서 작동하도록 하기
  if (key === 'ArrowDown') {
    // Down arrow key pressed
    const activeKeyword = keywordStore.moveActive('down');
    $inputNickname.value = activeKeyword.text;
    updateKeywordList(keywordStore.keywords);
    return;
  }
  if (key === 'ArrowUp') {
    // Up arrow key pressed
    const activeKeyword = keywordStore.moveActive('up');
    $inputNickname.value = activeKeyword.text;
    updateKeywordList(keywordStore.keywords);
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
