# ETC Trouble Shotting

## Promise returned in function argument where a void return was expected

```ts
const handleSubmit = async (event: Event) => {
  event.preventDefault();

  const userProfiles = await getGitHubUserProfile($inputNickname.value);
  $inputNickname.value = '';

  console.log('userProfiles', userProfiles);
};

$form.addEventListener('submit', handleSubmit);
// handleSubmit등록하는데 빨간줄, Promise returned in function argument where a void return was expected
```

아래와 같은 eslint 설정으로 에러 임시 해결

```json
{
  ...,
  "rules": [
    ...,
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ]
  ]
}

```

- https://typescript-eslint.io/rules/no-misused-promises/

## TS Node vs HTMLElement

```ts
const paragraph = document.querySelector('p');
paragraph instanceof Node; // => true
paragraph instanceof HTMLElement; // => true
```

- https://stackoverflow.com/questions/9979172/difference-between-node-object-and-element-object
- https://dmitripavlutin.com/dom-node-element/
- https://typescript-kr.github.io/pages/tutorials/dom-manipulation.html
- https://developer.mozilla.org/ko/docs/Web/API/HTMLElement

## innerHtml 자동 포맷팅

네이밍 변경으로 해결 (dom -> html): 정확한 이유는 모르겠다.

```md
수정전
```

```ts
const $searchForm = () => dom`
  <div id="searchFormContainer">
    <form id="searchForm">
      <input id="inputNickname" type="text" name="nickname" placeholder="search for nickname" />
      <button>제출</button>
    </form>
    ${$searchAutoComplete()}
    <div id="searchHistory" class="display-none">
      <ul></ul>
      <div>
        <button id="searchHistoryDeleteAll">전체 삭제</button>
      </div>
    </div>
  </div>
`;
```

```md
수정후
```

```ts
const $searchForm = () => html`
  <div id="searchFormContainer">
    <form id="searchForm">
      <input id="inputNickname" type="text" name="nickname" placeholder="search for nickname" />
      <button>제출</button>
    </form>
    ${$searchAutoComplete()}
    <div id="searchHistory" class="display-none">
      <ul></ul>
      <div>
        <button id="searchHistoryDeleteAll">전체 삭제</button>
      </div>
    </div>
  </div>
`;
```

- https://stackoverflow.com/questions/68919289/how-can-i-prettier-template-literal-in-javascript-with-intellij

## typescript this 타입 지정하기

```ts
export const debounce = <F extends (...args: any[]) => void>(
  callback: F,
  delay: number,
): ((...args: any[]) => void) => {
  let timeoutId: NodeJS.Timeout;

  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
};
```

`you need to explicitly specify the type of this when you use it inside a function to ensure that it matches the expected type.`

```ts
const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
```

- `ThisParameterType` 유틸리티 유형은 디바운스되는 원래 함수의 this 유형과 일치하는 함수 내에서 this의 유형을 지정하는 데 사용
- `Parameters` 유틸리티 유형은 원래 함수의 예상 인수와 일치하는 args 매개변수의 유형을 지정하는 데 사용
- `ReturnType` 유형은 setTimeout 함수의 반환 유형과 일치하는 timeoutId 유형을 지정하는 데 사용

- https://stackoverflow.com/questions/41944650/this-implicitly-has-type-any-because-it-does-not-have-a-type-annotation
