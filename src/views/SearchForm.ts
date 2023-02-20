import { GitHubUser } from '@/apis';
import { $, html } from '@/utils/dom';

const $searchForm = () => html`
  <div id="searchFormContainer">
    <form id="searchForm">
      <input id="inputNickname" type="text" name="nickname" placeholder="search for nickname" />
      <button>제출</button>
    </form>
    ${$searchAutoComplete()}
    <div id="searchHistory" class="display-none">
      <ul></ul>
      <div>
        <button id="searchHistoryDeleteAll">전체 삭제</button>
      </div>
    </div>
  </div>
`;

export const $searchAutoComplete = (users?: GitHubUser[]) => {
  const $searchAutoComplete = $('#searchAutoComplete');
  if (!$searchAutoComplete || !users) {
    return html`<div id="searchAutoComplete" class="display-none">
      <h4></h4>
      <ul></ul>
      <div>
        <button id="searchAutoCompleteDeleteAll">전체 삭제</button>
      </div>
    </div>`;
  }

  $searchAutoComplete.classList.toggle('display-none');

  const $autoSuggestions = html`${users.map(
    user => html`<li id="searchAutoCompleteTerm" data-searchAutoComplete-id=${user.id}>${user.login}</li>`,
  )}`;
  $searchAutoComplete.innerHTML = '';
  $searchAutoComplete.appendChild($autoSuggestions);
  return $searchAutoComplete;
};

export default $searchForm;
