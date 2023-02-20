import '@/style/index.scss';
import handleSearchFormEvent from '@/controllers/event';
import { $, html } from '@/utils/dom';
import $searchForm from '@/views/SearchForm';
import $userList from '@/views/UserList';

const $root = $('#root');

const $app = html`${$searchForm()} ${$userList()}`;

function init() {
  $root.appendChild($app);
  handleSearchFormEvent();
}

window.addEventListener('DOMContentLoaded', init);
