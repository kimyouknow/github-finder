import { getGitHubUserProfile } from '@/apis';
import { $ } from '@/utils/dom';
import { debounce } from '@/utils/optimize';
import { $searchAutoComplete } from '@/views/SearchForm';
import $userList from '@/views/UserList';

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  const $SearchForm = $<HTMLElement>('#searchFormContainer');
  const $inputNickname = $<HTMLInputElement>('#inputNickname', $SearchForm);

  const { items, total_count } = await getGitHubUserProfile($inputNickname.value);
  $inputNickname.value = '';
  $userList(items);
};

const handleSearchInput = debounce(async (event: Event) => {
  const eventTarget = event?.target as HTMLInputElement;
  console.log(eventTarget.value);
  const $SearchForm = $<HTMLElement>('#searchFormContainer');
  const $inputNickname = $<HTMLInputElement>('#inputNickname', $SearchForm);
  if ($inputNickname.value === '') return;
  const { items, total_count } = await getGitHubUserProfile($inputNickname.value, 10);
  $searchAutoComplete(items);
}, 1000);

const handleSearchFormEvent = () => {
  const $SearchForm = $<HTMLElement>('#searchFormContainer');
  const $form = $<HTMLFormElement>('#searchForm', $SearchForm);
  const $inputNickname = $<HTMLInputElement>('#inputNickname', $SearchForm);

  $form.addEventListener('submit', handleSubmit);
  $inputNickname.addEventListener('input', handleSearchInput);
};

export default handleSearchFormEvent;
``;
