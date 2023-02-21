import { GitHubUser } from '@/apis';
import { html } from '@/utils/dom';

const UserList = (users?: GitHubUser[]) => {
  const $users = users ? html`${users.map(user => html`<li>${user.login}</li>`)}` : '';
  return html`<ul id="userList">
    ${$users}
  </ul>`;
};

export default UserList;
