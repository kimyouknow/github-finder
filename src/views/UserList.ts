import { UserProfile } from '@/controllers/service/userProfile';
import { html } from '@/utils/dom';

const UserList = (users?: UserProfile[]) => {
  const $users = users
    ? html`${users.map(
        user => html`<li class="user-element">
          <img src=${user.avatarUrl} alt="avatarUrl" class="user-element__avatar" />
          <div class="user-element__info-list">
            <div class="user-element__info">
              <span class="user-element__info-key">Nickname</span>
              <span class="user-element__info-value">${user.nickname}</span>
            </div>
            <div class="user-element__info">
              <span class="user-element__info-key">Github URL</span>
              <span class="user-element__info-value">
                <a href=${user.htmlUrl}>${user.htmlUrl}</a></span
              >
            </div>
          </div>
        </li>`,
      )}`
    : '';
  return html`<ul id="userList" class="user-list">
    ${$users}
  </ul>`;
};

export default UserList;
