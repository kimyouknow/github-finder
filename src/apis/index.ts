import { GITHUB_API_TOKEN } from '@/constant';
import { fetchData } from '@/utils/fetch';

export interface GitHubUser {
  id: number;
  login: string;
  html_url: string;
  avatar_url: string;
}

export interface GithubUserList {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}

export type SearchType = 'code' | 'users';

const coreGithubSearchRequest = async <T>(type: SearchType, query: string) => {
  const githubOpenApiHeader = {
    headers: {
      Authorization: `Bearer ${GITHUB_API_TOKEN}`,
    },
  };
  const result = await fetchData<T>(`https://api.github.com/search/${type}?${query}`, githubOpenApiHeader);
  return result;
};

// HTTP Status code	Description
// 200	: OK
// 304	: Not modified
// 422	: Validation failed, or the endpoint has been spammed.
// 503	: Service unavailable
export const getGitHubUserProfile = async (username: string, per_page = 30): Promise<GithubUserList> => {
  const query = `q=${username}&per_page=${per_page}`;
  const users = await coreGithubSearchRequest<GithubUserList>('users', query);
  return users;
};
