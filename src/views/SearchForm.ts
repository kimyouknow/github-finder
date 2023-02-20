import { GitHubUser } from '@/apis';
import { $, html } from '@/utils/dom';

const $searchForm = () => html`
  <div id="search-form-container">
    <form id="search-form">
      <input id="input-nickname" type="text" name="nickname" placeholder="search for nickname" />
      <button>제출</button>
    </form>
    ${$searchAutoComplete()}
    <div id="search-history" class="display-none">
      <ul></ul>
      <div>
        <button id="search-history-delete-all">전체 삭제</button>
      </div>
    </div>
  </div>
`;

export const $searchAutoComplete = (users?: GitHubUser[]) => {
  const $searchAutoComplete = $('#search-auto-complete');
  if (!$searchAutoComplete || !users) {
    return html`<div id="search-auto-complete" class="display-none">
      <h4></h4>
      <ul></ul>
      <div>
        <button id="search-auto-complete-delete-all">전체 삭제</button>
      </div>
    </div>`;
  }

  $searchAutoComplete.classList.toggle('display-none');

  const $autoSuggestions = html`${users.map(
    user => html`<li id="search-auto-complete-term" data-search-auto-complete-id=${user.id}>${user.login}</li>`,
  )}`;
  $searchAutoComplete.innerHTML = '';
  $searchAutoComplete.appendChild($autoSuggestions);
  return $searchAutoComplete;
};

export default $searchForm;
