import { getGitHubUserProfile } from '@/apis';

export type UserProfile = {
  id: number;
  nickname: string;
  htmlUrl: string;
  avatarUrl: string;
};

interface UserProfileStore {
  userProfileCount: number;
  userProfiles: UserProfile[];
  requestUserProfile: (text: string) => Promise<void>;
  updateUserProfile: (userProfiles: UserProfile[], count: number) => void;
}

const userProfileStore: UserProfileStore = {
  userProfiles: [],
  userProfileCount: 0,
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
    this.userProfiles = userProfiles;
    this.userProfileCount = count;
  },
};

export default userProfileStore;
