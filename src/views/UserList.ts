import { GitHubUser } from '@/apis';
import { $, html } from '@/utils/dom';

const $userList = (users?: GitHubUser[]) => {
  const $userList = $('#userList');
  if (!$userList || !users) {
    return html`<ul id="userList"></ul>`;
  }
  const $users = html`${users.map(user => html`<li>${user.login}</li>`)}`;
  $userList.innerHTML = '';
  $userList.appendChild($users);
  return $userList;
};

export default $userList;
