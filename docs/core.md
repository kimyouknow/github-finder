# Core 만들기

## 목표

- 관심사가 분리된 구조 만들기
- vanilla로 만들면서 dom 조작 및 event 조작에 대해 공부
- 선언적 프로그래밍과 추상화 (절차지향적인 코드 ❌)

## 구체화

> 비즈니스 로직과 뷰 로직을 분리하기

### 흐름

프론트엔드는 아래와 같은 흐름을 가지고 있다고 생각한다.

```md
상태 요청 및 정리 -> dom 렌더링 -> 이벤트 등록 -> 이벤트 발생 -> 상태 변경(local, server) -> dom 렌더링
```

### 사례 찾아보기

- vue: mvvm
  - vm의 기능: 데이터 바인딩(화면에 보이는 데이터와 브라우저 상의 메모리를 일치 시킨다.)
- react: flux
  - v과 m 간의 관계가 복잡해지니까 이를 단순화하려는 흐름

### 예전에 만들었던 mvc 패턴

- m(model): 상태 관리(store)
- v(view): dom(html)
- c(controller): m과 v를 묶고, event관리

[관심사분리](https://github.com/kimyouknow/soc-template)

문제점

- view가 너무 복잡하다.
  - 프론트는 view에서 이벤트가 발생한다.
  - view에서 이벤트가 발생해서 상태를 바꾸고 model이 변경되면 또 다른 view가 변해야할 경우도 있다.
- view는 계층적이다.
  - 하위 계층을 모두 리렌더링할 수 있다.
- 보통 c가 m과 v를 이어주는데 c가 복잡해진다.
  - view에 상태를 묶어 상태가 변경되면 알아서 렌더링될 수 있도록 했다.
  - event는 상태변경만 요청한다.

## 1차 : event 중심

### 핵심기능(검색창)

- 검색어가 입력되면 자동완성 쿼리를 요청한다.
- 자동완성목록을 키보드(위, 아래)방향키로 탐색할 수 있다. 현재 선택한 키워드는 input창에 반영된다.
- 검색어를 제출하면 검색결과를 렌더링한다.

### 단점

event중심으로 코드를 작성하면서 느낀 단점은 아래와 같다.

### view

- dom을 생성하는 부분(dom렌더링 함수)
- 중첩된 dom구조에서 가독성 좋게 사용 가능해야한다.
- 예시

```ts
export const SearchAutoComplete = (keywords?: Keyword[]) => {
  return html`<div id="searchAutoComplete" class="display-none">
    <h4></h4>
    ${keywords ? KeywordList(keywords) : EmptyKeyword()}
    <div>
      <button id="searchAutoCompleteDeleteAll">전체 삭제</button>
    </div>
  </div>`;
};

export const EmptyKeyword = () => {
  return html`<ul>
    <h4>일치하는 키워드가 없습니다.</h4>
  </ul>`;
};

export const KeywordList = (keywords: Keyword[]) => {
  return html`<ul id="keywordList">
    ${keywords.map(
      ({ id, text, isActive }, idx) =>
        html`<li data-id=${id} data-rank=${idx} class=${isActive ? 'keyword-active' : ''}>
          ${text}
        </li>`,
    )}
  </ul>`;
};
```

### event

- 이벤트 등록을 어디서 할지
  - view를 렌더링할 때 등록 vs 별도로 등록
  - 별도의 event.js파일에서 이벤트를 등록하고하자는 dom을 탐색한 뒤 이벤트를 등록했다.
- service에서 상태 변경
  - event handler와 구분된 상태 변경 로직
- view 렌더링
  - event 발생 -> 상태 변경 -> 새로운 view 렌더링

```ts
const handleAutoComplete = async () => {
  const $searchForm = $<HTMLElement>('#searchFormContainer');
  const $inputNickname = $<HTMLInputElement>('#inputNickname', $searchForm);
  let $searchAutoComplete = $<HTMLElement>('#searchAutoComplete', $searchForm);

  if ($inputNickname.value === '') {
    $searchAutoComplete.outerHTML = SearchAutoComplete();
    return;
  }
  await userProfileStore.requestUserProfile($inputNickname.value);
  const userProfiles = userProfileStore.userProfiles;
  const keywords: Keyword[] = userProfiles.map(({ id, nickname }) => ({
    id,
    text: nickname,
    isActive: false,
  }));
  $searchAutoComplete.outerHTML = SearchAutoComplete(keywords);
  keywordStore.getKeywords(keywords);
  // 다시 탐색해서 dom을 선택해야 outerHTML로 선택한 dom이 선택됨
  $searchAutoComplete = $<HTMLElement>('#searchAutoComplete', $searchForm);
  $searchAutoComplete.classList.toggle('display-none');
};
```

### 구현 결과

https://user-images.githubusercontent.com/71386219/220572280-ace2efc5-af68-445a-b1e9-3d09e701e738.mov

## 2차 적용: 상태 기반 렌더링

### view

- 데이터 상태가 변경될 때 쉽게 렌더링되어야한다.
