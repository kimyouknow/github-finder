import { Keyword } from '@/controllers/service/keywords';
import { html } from '@/utils/dom';

const SearchForm = () => html`
  <div id="searchFormContainer">
    <form id="searchForm">
      <input
        id="inputNickname"
        type="text"
        name="nickname"
        placeholder="search for nickname"
        autocomplete="off"
      />
      <button>제출</button>
    </form>
    ${SearchAutoComplete()} ${SearchHistory()}
  </div>
`;

export const SearchHistory = (keywords?: Keyword[]) => {
  return html`<div id="searchHistory" class="display-none">
    <h4>최근 검색어</h4>
    ${keywords ? KeywordList(keywords, 'history') : EmptyKeyword()}
    <div>
      <button id="searchHistoryDeleteAll">전체 삭제</button>
    </div>
  </div>`;
};

export const SearchAutoComplete = (keywords?: Keyword[]) => {
  return html`<div id="searchAutoComplete" class="display-none">
    <h4>검색어 자동 완성</h4>
    ${keywords ? KeywordList(keywords, 'autoComplete') : EmptyKeyword()}
    <div>
      <button id="searchAutoCompleteDeleteAll">전체 삭제</button>
    </div>
  </div>`;
};

export const EmptyKeyword = () => {
  return html`<ul>
    <h4>일치하는 키워드가 없습니다.</h4>
  </ul>`;
};

export const KeywordList = (keywords: Keyword[], type: 'autoComplete' | 'history') => {
  return html`<ul id="keywordList" data-keyword-type=${type}>
    ${keywords.map(
      ({ id, text, isActive }, idx) =>
        html`<li data-id=${id} data-rank=${idx} class=${isActive ? 'keyword-active' : ''}>
          ${text}
        </li>`,
    )}
  </ul>`;
};

export default SearchForm;
