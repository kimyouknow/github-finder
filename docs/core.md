# Core 만들기

> 아무도 유지 관리하지 않는 또 다른 프레임워크를 만들지 마라~ 필요하다고 예측할 때가 아니라 실제로 필요할 떄 구현해라

Vanilla Javascript는 브라우저 상에서 동작하는 웹 애플리케이션을 개발하는 데에 필수적인 프로그래밍 언어입니다. 많은 Javascript 라이브러리와 프레임워크들은 Vanilla Javascript를 기반으로 구현됩니다. 이를 이해하기 위해서는 바닐라 자바스크립트를 충분히 이해하고 있어야 합니다. Vanilla Javascript로 간단한 기능을 구현하며 라이브러리나 프레임워크에 의존하지 않고 효율적인 코드를 작성할 수 있는 능력을 기를 수 있을까 하는 생각에 해당 프로젝트를 시작했습니다.

유명한 글인 [Vanilla Javascript로 웹 컴포넌트 만들기](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Component/)를 참고해서 구현해본 경험이 있습니다. 해당 글에서는 직접 DOM을 조작하지 않고 상태를 기반으로 DOM을 렌더링하는 방법으로 웹 컴포넌트를 구현했습니다.

웹 컴포넌트도 좋지만 저는 `View(HTML)와 Logic(Javascript)을 분리하면 더 코드를 작성하고 관리하는데 쉽지 않을까`하는 생각이 들었습니다.

이것저것 찾아보다 [Vanilla JS와 함께 지속가능한 프런트엔드 코드 만들기 - 인프런 수강바구니 개선기 | 인프콘 2022](https://youtu.be/K1lKgxeXDrs)에서 설명해주신 구조를 바탕으로 구현해봤습니다.

## 목표

### 관심사가 분리된 구조 만들기

- 순수한 View
- 상태관리
- 이벤트 핸들러

### vanilla로 만들면서 DOM 조작 및 Event 조작에 대해 공부

- 프론트는 View에서 이벤트가 발생한다.
- view에서 이벤트가 발생해서 상태를 바꾸고 model이 변경되면 또 다른 view가 변해야할 경우도 있다.

### 선언적 프로그래밍과 추상화 (절차지향적인 코드 ❌)

- MVC패턴에서 C가 M과 V를 이어주는데 C가 복잡해진다.
  - View에 상태를 묶어 상태가 변경되면 알아서 렌더링될 수 있도록 했다.
  - Event는 상태변경만 요청한다.

### View를 최대한 단순화하기

- 웹용 렌더링 엔진: 가독성과 유지 관리성을 고려해야 한다.
- 순수한 view: `view = fn(state)`
- view는 계층적이다.
  - 하위 계층을 모두 리렌더링할 수 있다.

### 사례 찾아보기

- Vue: MVVM
  - vm의 기능: 데이터 바인딩(화면에 보이는 데이터와 브라우저 상의 메모리를 일치 시킨다.)
- React: Flux
  - v과 m 간의 관계가 복잡해지니까 이를 단순화하려는 흐름

## 구체화

> 비즈니스 로직과 뷰 로직을 분리하기

### 흐름

프론트엔드는 아래와 같은 흐름을 가지고 있다고 생각합니다.

```md
상태 요청 및 정리 -> dom 렌더링 -> 이벤트 등록 -> 이벤트 발생 -> 상태 변경(local, server) -> dom 렌더링
```

## 1차 : Event 중심

### 비즈니스 로직

📌 business logic data

- 외부에서 접근 불가능한 상태 분리

📌 business logic

- business logic data를 관리하는 로직
- DTO
  - server 데이터 키 값을 front값으로 변경(ex: snake -> carmel)
- 명령과 조회 분리
  - http method에서 뿐만 아니라 로컬 상태 관리에서도
  - 명령: 상태를 변경, 상태를 반환하지 않는 메서드 (ex: post, patch, delete과 같은 http method)
  - 조회: 결과를 반환, 상태를 변환하지 않는 메서드 (ex: get과 같은 http method )

### UI 업데이트 로직

📌 view state

- dom selector & event handler

📌 view logic

- ex: updateOrderInfoView()

### 1차 시도의 단점

Event중심으로 코드를 작성하면서 느낀 단점은 아래와 같다.

### View

- 하나의 DOM에 대해서 DOM을 생성하는 함수와 Update함수 2개가 필요하다.
- DOM을 조작하기 위해 id를 사용하고 CSS를 적용하기 위해 class를 사용한다. 마크업을 하기 위해 View, scss, update 3가지 파일을 봐야할 때도 있다.
- 예시

```ts
/// src/views
export const SearchAutoComplete = (keywords?: Keyword[]) => {
  return html`<div id="searchAutoComplete" class="keywords display-none">
    <h4 class="keywords__header">검색어 자동 완성</h4>
    ${KeywordList('autoComplete', keywords)}
    <div class="keywords__footer">
      <button id="searchAutoCompleteDeleteAll" class="keywords__del-all">전체 삭제</button>
    </div>
  </div>`;
};

export const EmptyKeyword = () => {
  return html`<ul>
    <h4 class="keywords__header">일치하는 키워드가 없습니다.</h4>
  </ul>`;
};

export const KeywordList = (type: 'autoComplete' | 'history', keywords?: Keyword[]) => {
  if (!keywords || keywords.length === 0) return EmptyKeyword();

  const isActiveClass = (isActive: boolean) => (isActive ? 'keyword-active' : '');

  return html`<ul id="keywordList" data-keyword-type=${type} class="keywords__ul">
    ${keywords.map(
      ({ id, text, isActive }, idx) =>
        html`<li data-id=${id} data-rank=${idx} class="keywords__li ${isActiveClass(isActive)}">
          ${text}
        </li>`,
    )}
  </ul>`;
};
```

```ts
/// src/controllers/event
export const updateSearchAutoCompleteList = (keywords?: Keyword[]) => {
  const $searchAutoComplete = $<HTMLElement>('#searchAutoComplete');
  render($searchAutoComplete, SearchAutoComplete, keywords);
};

export const showAutoCompleteList = () => {
  const $searchAutoComplete = $<HTMLElement>('#searchAutoComplete');
  $searchAutoComplete.classList.remove('display-none');
};

export const hideAutoCompleteList = () => {
  const $searchHistory = $<HTMLElement>('#searchAutoComplete');
  $searchHistory.classList.add('display-none');
};
```

### Event

- 이벤트 등록을 어디서 할지
  - 📌 DOM이 생성된 뒤에 해당 DOM에 Event를 등록해야 한다.
  - View를 렌더링할 때 등록 vs 별도로 등록
  - 별도의 event.js파일에서 이벤트를 등록하고하자는 dom을 탐색한 뒤 이벤트를 등록했다.
  - DOM이 다시 렌더링되면 Event도 다시 등록해야 한다.
    - `Event Delegation`을 활용해 리렌더링할 때마다 Event를 다시 등록해야하는 번거로움은 줄였다.
- 절차지향적인 코드를 작성하게 된다.

  - event 발생 -> 상태 변경 -> 새로운 view 렌더링: 일련의 흐름을 Event Handler에서 관리한다.
  - 최대한 선언적으로 작성하려고 노력했지만 원하는 코드 조각을 찾기 위해 디버깅하듯 엔트리부터 차례대로 접근할 수 밖에 없다.

- 현재 이벤트 발생(상태변경) 이후 렌더링을 render함수를 활용해 수동으로 하고 있다. 수동은 실수 및 오류를 발생할 수 있는 가능성을 높힌다.

## 2차 적용: 상태 기반 렌더링

- render함수를 상태 관리 로직에 바인딩하기
