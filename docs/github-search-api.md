# github-search-api

## github open api access token 등록

REST API에는 검색에 대한 사용자 지정 속도 제한이 있다. 기본 인증, OAuth 또는 클라이언트 ID 및 비밀을 사용하는 요청의 경우 분당 최대 30개의 요청을 만들 수 있다. 인증되지 않은 요청의 경우 속도 제한을 사용하면 분당 최대 10개의 요청을 만들 수 있다.

Github API 는 인증을 하지 않아도 사용할 수 있다. 하지만 인증 없이 사용하면 시간당 요청 횟수가 제한된다.

### 등록 방법

`Settings -> Developer settings -> Personal access tokens`로 이동 이후 원하는 `scope`를 선택한 뒤 token을 발급한다.

토큰을 발급한 이후 fetch 요청에 아래와 같이 header에 token을 삽입하면 된다.

```ts
const githubOpenApiHeader = {
  headers: {
    Authorization: `Bearer ${GITHUB_API_TOKEN}`,
  },
};
```

## github open api search 사용하기

> 공식문서에 request 및 response 타입이 자세하게 살명되어있다.

공식문서에는 `Octokit.js` 라이브러리를 추천했지만 fetch함수를 직접 커스텀해서 사용할 계획이라 해당 라이브러리를 사용하지 않았다.

```bash
# Search users
curl \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>"\
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/search/users?q=Q
```

## 프로젝트에 적용한 방식

작성 중

<!-- !TODO 작성중 -->

## 참고 자료

- https://docs.github.com/en/rest/search?apiVersion=2022-11-28
- https://docs.github.com/ko/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
