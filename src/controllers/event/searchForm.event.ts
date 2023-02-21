import { getGitHubUserProfile } from '@/apis';
import { $ } from '@/utils/dom';
import { debounce } from '@/utils/optimize';
import { SearchAutoComplete } from '@/views/SearchForm';
import userList from '@/views/UserList';

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  const $searchForm = $<HTMLElement>('#searchFormContainer');
  const $inputNickname = $<HTMLInputElement>('#inputNickname', $searchForm);

  const { items, total_count } = await getGitHubUserProfile($inputNickname.value);
  $inputNickname.value = '';
  userList(items);
};

const handleSearchInput = debounce(1000, async (event: Event) => {
  const $searchForm = $<HTMLElement>('#searchFormContainer');
  const $inputNickname = $<HTMLInputElement>('#inputNickname', $searchForm);
  let $searchAutoComplete = $<HTMLElement>('#searchAutoComplete', $searchForm);
  if ($inputNickname.value === '') {
    $searchAutoComplete.outerHTML = SearchAutoComplete();
    return;
  }
  const { items, total_count } = await getGitHubUserProfile($inputNickname.value, 10);
  $searchAutoComplete.outerHTML = SearchAutoComplete(items);
  // 다시 탐색해서 dom을 선택해야 outerHTML로 선택한 dom이 선택됨
  $searchAutoComplete = $<HTMLElement>('#searchAutoComplete', $searchForm);
  $searchAutoComplete.classList.toggle('display-none');
});

export const $activeKeywordList = () => {
  const $keywordList = $('#keywordList');
  if ($keywordList) {
    return;
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  const { key } = event;
  // TODO $inputNickname에 값이 있으면 자동 검색 , 없으면 최근 검색 기록 보여주기
  // TODO 활성화되어 있는 창에서 작동하도록 하기
  switch (key) {
    case 'ArrowDown': // Down arrow key pressed
      break;
    case 'ArrowUp': // Up arrow key pressed
      break;
    default:
      break;
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
