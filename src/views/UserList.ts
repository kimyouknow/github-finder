import { UserProfile } from '@/controllers/service/userProfile';
import { html } from '@/utils/dom';

const UserList = (users?: UserProfile[]) => {
  const $users = users ? html`${users.map(user => html`<li>${user.nickname}</li>`)}` : '';
  return html`<ul id="userList">
    ${$users}
  </ul>`;
};

export default UserList;
