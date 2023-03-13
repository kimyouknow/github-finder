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

## Input 값 변경시 focus가 맨 앞에 찍히는 에러

```ts
const updateInputText = (text: string) => {
  const $inputNickname = $<HTMLInputElement>('#inputNickname');
  $inputNickname.value = text;
};

const handleKeyDownSearchInput = (event: KeyboardEvent) => {
  // 생략
  if (key === 'ArrowDown') {
    updateInputText(activeKeyword.text);
  }
  if (key === 'ArrowUp') {
    // 이 때만 아래와 같은 에러 발생
    updateInputText(activeKeyword.text);
  }
  // 생략
};
```

에러 결과

```bash
# | : 커서 위치
# 이동전
asdf|
# 이동후
|new
```

### 해결

keyup 이벤트로 input창으로 돌아갈 시, 커서가 글자의 맨 앞에 오는 버그
ArrowDown, ArrowUp, ArrowLeft, ArrowRight 일 때 defalut로 설정해주는 커서 포인터가 있다.
ArrowUp일 때는 커서가 맨앞으로 가도록 설정되어 있기 때문
event.key가 ArrowUp일 때는 event.preventDefault가 되도록 설정하여 해결

```js
const handleKeyDownSearchInput = (event: KeyboardEvent) => {
  event.preventDefault();
};

// 이렇게 하면 한글만 써지고, 영어, 숫자 안써짐
```

## @babel/preset-env useBuiltIns과 corejs 옵션

babel.config.json

아래와 같이 하면 에러 발생ㅇ

```json
{
  "presets": [
    [
      "@babel/preset-env",
      { "targets": "> 0.25%, not dead", "modules": false, "useBuiltIns": "usage", "corejs": 3 }
    ],
    "@babel/preset-typescript"
  ]
}
```

에러

```bash
core-js/modules/es.array.*.js
```

### 분석

아직 이해하지 못함

#### core-js@3

#### useBuiltIns

> When either the usage or entry options are used, @babel/preset-env will add direct references to core-js modules as bare imports (or requires). This means core-js will be resolved relative to the file itself and needs to be accessible. (@babel/preset-env는 core-js 모듈에 대한 직접 참조를 베어 가져오기(또는 필요)로 추가한다. 이는 core-js가 파일 자체와 관련하여 해결되며 액세스할 수 있어야 함을 의미한다.)

- https://babeljs.io/docs/babel-preset-env#usebuiltins
- https://velog.io/@vnthf/corejs3로-대체하자-zok3p9aouy
- https://tech.kakao.com/2020/12/01/frontend-growth-02/

## 이벤트 등록 불편함

display none 상태에서 등록한 이벤트가 등록되지 않아서, 돔이 렌더링 될때마다 이벤트를 달아줘야함

해결

delegation으로 해결

```ts
const bindEventToChildren = (event: Event) => {
  const $deleteAllButton = $<HTMLButtonElement>('#searchHistoryDeleteAll');
  if (event.target === $deleteAllButton) {
    handleClickDeleteAllButton(event);
  }
};
```
