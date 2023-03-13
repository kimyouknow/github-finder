import { Keyword } from '@/controllers/service/keywords';
import { UserProfile } from '@/controllers/service/userProfile';
import { $, render } from '@/utils/dom';
import { KeywordList, SearchAutoComplete, SearchHistory } from '@/views/SearchForm';
import UserList from '@/views/UserList';

// Update View

export const updateInput = (text?: string) => {
  const $inputNickname = $<HTMLInputElement>('#inputNickname');
  $inputNickname.value = text || '';
};

export const updateUserProfileList = (userProfiles: UserProfile[]) => {
  const $userList = $<HTMLElement>('#userList');
  render($userList, UserList, userProfiles);
};

export const updateSearchAutoCompleteList = (keywords?: Keyword[]) => {
  const $searchAutoComplete = $<HTMLElement>('#searchAutoComplete');
  render($searchAutoComplete, SearchAutoComplete, keywords);
};

export const toggleSearchAutoCompleteList = () => {
  const $searchAutoComplete = $<HTMLElement>('#searchAutoComplete');
  $searchAutoComplete.classList.toggle('display-none');
};

export const updateKeywordList = (keywords: Keyword[], type: 'autoComplete' | 'history') => {
  const $keywordList = $<HTMLElement>('#keywordList');
  render($keywordList, KeywordList, type, keywords);
};

export const updateSearchHistory = (keywords?: Keyword[]) => {
  const $searchHistory = $<HTMLElement>('#searchHistory');
  render($searchHistory, SearchHistory, keywords);
};

export const toggleSearchHistory = () => {
  const $searchHistory = $<HTMLElement>('#searchHistory');
  $searchHistory.classList.toggle('display-none');
};

export const showSearchHistory = () => {
  const $searchHistory = $<HTMLElement>('#searchHistory');
  $searchHistory.classList.remove('display-none');
};

export const showAutoCompleteList = () => {
  const $searchAutoComplete = $<HTMLElement>('#searchAutoComplete');
  $searchAutoComplete.classList.remove('display-none');
};

export const hideSearchHistory = () => {
  const $searchHistory = $<HTMLElement>('#searchHistory');
  $searchHistory.classList.add('display-none');
};

export const hideAutoCompleteList = () => {
  const $searchHistory = $<HTMLElement>('#searchAutoComplete');
  $searchHistory.classList.add('display-none');
};

export const updateInputText = (text: string) => {
  const $inputNickname = $<HTMLInputElement>('#inputNickname');
  $inputNickname.value = text;
  $inputNickname.focus();
};
