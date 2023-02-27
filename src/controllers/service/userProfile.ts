import { getGitHubUserProfile } from '@/apis';
import { cloneDeep } from '@/utils';

export type UserProfile = {
  id: number;
  nickname: string;
  htmlUrl: string;
  avatarUrl: string;
};

interface UserProfileState {
  userProfiles: UserProfile[];
  userProfileCount: number;
}

const UserProfile = () => {
  const state: UserProfileState = {
    userProfiles: [],
    userProfileCount: 0,
  };
  return {
    getUserProfiles() {
      // return Object.freeze(cloneDeep(state.userProfiles)); // FIXME: Argument of type 'readonly UserProfile[]' is not assignable to parameter of type 'UserProfile[]'.
      return cloneDeep(state.userProfiles);
    },
    async requestUserProfile(text: string) {
      const { items, total_count } = await getGitHubUserProfile(text);
      const profiles = items.map(({ id, login, html_url, avatar_url }) => ({
        id,
        nickname: login,
        htmlUrl: html_url,
        avatarUrl: avatar_url,
      }));
      this.updateUserProfile(profiles, total_count);
    },
    updateUserProfile(userProfiles: UserProfile[], count: number) {
      state.userProfiles = cloneDeep(userProfiles);
      state.userProfileCount = count;
    },
  };
};

const userProfileStore = UserProfile();

export default userProfileStore;
