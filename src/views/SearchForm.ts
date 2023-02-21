import { GitHubUser } from '@/apis';
import { html } from '@/utils/dom';

const SearchForm = () => html`
  <div id="searchFormContainer">
    <form id="searchForm">
      <input id="inputNickname" type="text" name="nickname" placeholder="search for nickname" />
      <button>제출</button>
    </form>
    ${SearchAutoComplete()}
    <div id="searchHistory" class="display-none">
      <ul></ul>
      <div>
        <button id="searchHistoryDeleteAll">전체 삭제</button>
      </div>
    </div>
  </div>
`;

export const KeywordList = (keywords: Array<{ id: number; text: string }>, id: string) => {
  return html`<ul id="keywordList ${id}List">
    ${keywords.map(({ id, text }, idx) => html`<li data-id=${id} data-rank=${idx}>${text}</li>`)}
  </ul>`;
};

export const SearchAutoComplete = (users?: GitHubUser[]) => {
  const keywords = users ? users.map(({ id, login }) => ({ id, text: login })) : [];
  return html`<div id="searchAutoComplete" class="display-none">
    <h4></h4>
    ${KeywordList(keywords, 'autoComplete')}
    <div>
      <button id="searchAutoCompleteDeleteAll">전체 삭제</button>
    </div>
  </div>`;
};

export default SearchForm;
