import { getGitHubUserProfile } from '@/apis';
import { cloneDeep } from '@/utils';

export type UserProfile = {
  id: number;
  nickname: string;
  htmlUrl: string;
  avatarUrl: string;
};

interface UserProfileStore {
  userProfileCount: number;
  userProfiles: UserProfile[];
  getUserProfiles: () => UserProfile[];
  requestUserProfile: (text: string) => Promise<void>;
  updateUserProfile: (userProfiles: UserProfile[], count: number) => void;
}

const userProfileStore: UserProfileStore = {
  userProfiles: [],
  userProfileCount: 0,
  getUserProfiles() {
    return Object.freeze(cloneDeep(this.userProfiles)) as UserProfile[];
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
  updateUserProfile(userProfiles, count) {
    this.userProfiles = cloneDeep(userProfiles);
    this.userProfileCount = count;
  },
};

export default userProfileStore;
