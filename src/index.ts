import '@/style/index.scss';
import handleSearchFormEvent from '@/controllers/event';
import { $ } from '@/utils/dom';
import Header from '@/views/Header';
import SearchForm from '@/views/SearchForm';
import UserList from '@/views/UserList';

const $root = $('#root');

function init() {
  $root.innerHTML = `
    <main class="main">
      ${Header()}
      ${SearchForm()} 
      ${UserList()}
    </main>
  `;
  handleSearchFormEvent();
}

window.addEventListener('DOMContentLoaded', init);
