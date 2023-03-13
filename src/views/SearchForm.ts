import { Keyword } from '@/controllers/service/keywords';
import { html } from '@/utils/dom';

const SearchForm = () => html`
  <div id="searchFormContainer" class="search-form">
    <form id="searchForm" class="search-form__form">
      <input
        id="inputNickname"
        type="text"
        name="nickname"
        placeholder="Search Github"
        autocomplete="off"
        class="search-form__input"
      />
      <button class="search-form__button">검색</button>
    </form>
    ${SearchAutoComplete()} ${SearchHistory()}
  </div>
`;

export const SearchHistory = (keywords?: Keyword[]) => {
  return html`<div id="searchHistory" class="keywords display-none">
    <h4 class="keywords__header">최근 검색어</h4>
    ${KeywordList('history', keywords)}
    <div class="keywords__footer">
      <button id="searchHistoryDeleteAll" class="keywords__del-all">전체 삭제</button>
    </div>
  </div>`;
};

export const SearchAutoComplete = (keywords?: Keyword[]) => {
  return html`<div id="searchAutoComplete" class="keywords display-none">
    <h4 class="keywords__header">검색어 자동 완성</h4>
    ${KeywordList('autoComplete', keywords)}
    <div class="keywords__footer">
      <button id="searchAutoCompleteDeleteAll" class="keywords__del-all">전체 삭제</button>
    </div>
  </div>`;
};

export const EmptyKeyword = () => {
  return html`<ul>
    <h4 class="keywords__header">일치하는 키워드가 없습니다.</h4>
  </ul>`;
};

export const KeywordList = (type: 'autoComplete' | 'history', keywords?: Keyword[]) => {
  if (!keywords || keywords.length === 0) return EmptyKeyword();
  const isActiveClass = (isActive: boolean) => (isActive ? 'keyword-active' : '');
  return html`<ul id="keywordList" data-keyword-type=${type} class="keywords__ul">
    ${keywords.map(
      ({ id, text, isActive }, idx) =>
        html`<li data-id=${id} data-rank=${idx} class="keywords__li ${isActiveClass(isActive)}">
          ${text}
        </li>`,
    )}
  </ul>`;
};

export default SearchForm;
