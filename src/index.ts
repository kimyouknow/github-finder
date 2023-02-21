import '@/style/index.scss';
import handleSearchFormEvent from '@/controllers/event';
import { $ } from '@/utils/dom';
import SearchForm from '@/views/SearchForm';
import UserList from '@/views/UserList';

const $root = $('#root');

function init() {
  $root.innerHTML = `${SearchForm()} ${UserList()}`;
  handleSearchFormEvent();
}

window.addEventListener('DOMContentLoaded', init);
