import { Keyword } from '@/controllers/service/keywords';
import { UserProfile } from '@/controllers/service/userProfile';
import { $, render } from '@/utils/dom';
import { KeywordList, SearchAutoComplete } from '@/views/SearchForm';
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
  render($keywordList, KeywordList, keywords, type);
};

export const updateSeachHistory = (keywords?: Keyword[]) => {
  const $searchHistory = $<HTMLElement>('#searchHistory');
  render($searchHistory, SearchAutoComplete, keywords);
};

export const toggleSeachHistory = () => {
  const $searchHistory = $<HTMLElement>('#searchHistory');
  $searchHistory.classList.toggle('display-none');
};
