# Optimize: 구현 과정에서 알게 된 내용들

- 클로저는 함수가 선언될 때의 렉시컬 스코프(lexical scope)를 기억하고, 이 스코프를 실행 컨텍스트(lexical environment)와 함께 유지하는 것을 말한다.
  - 클로저는 함수와 그 함수가 선언된 렉시컬 스코프(함수가 선언될 당시의 유효 범위)의 조합으로 구성된 객체라고 할 수 있다. 클로저를 사용하면 함수 내에서 정의된 변수를 외부에서도 접근할 수 있다.
- `arguments` 객체: 실제 배열이 아닌 유사배열객체, 주로 ...args 형태로 사용한다.
- 함수를 매개변수로 전달하는 방법들(callback)
- 이벤트 리스너의 수신기 종류: 콜백함수 or EventListener 인터페이스를 구현하는 객체
  - `콜백 함수 자체`는 handleEvent() 메서드와 같은 매개변수, 같은 반환 값을 가진다. 즉, 콜백 함수는 발생한 이벤트를 설명하는 `Event 기반 객체를 유일한 매개변수로 받고, 아무것도 반환하지 않는다.
- event 객체 전달
  - event는 자동으로 함수에 전달됨. addEventListener에 전달하는 함수의 첫 번째 인수로 지정하기만 하면 된다.
  - arguments의 첫 번째 인자로 event 객체가 전달된다.
- Arrow function에서 this
  - 화살표 함수(arrow function)는 함수를 선언할 때 this에 바인딩할 객체가 정적으로 결정된다. 동적으로 결정되는 일반 함수와는 달리 화살표 함수의 this 언제나 상위 스코프의 this를 가리킨다.

## 불필요한 이벤트 발생

resize나 onmousemove같은 이벤트는 이벤트 발생이 자주 일어난다. resize의 경우 창 크기를 조절할 때마다 발생하고, mouseover는 마우스가 움직일 때마다 발생한다.

연산이 오래걸리는 작업이나 dom조정작업이 이벤트가 발생할 때마다 실행하면 불필요한 연산을 지속적으로 발생시켜 좋지 못한 ux로 이어질 수 있다.

> 정말 resize될때마다 원하니? 아니면 resize가 완료되면 함수가 실행되길 바라는지 판단하기

## 감지할 이벤트 종류

> input, keyup, keydown, keypress, resize, mousemove...

## 1번 시도: delayListenEvent() - setTimeout 활용

addEventListener의 이벤트핸들러는 이벤트가 발생할 때마다 실행됨.

1. callback함수를 실행시키지 않다가 특정 시간(ms)이후에 동작하게 하기

2. 실행된 이벤트 핸들러를 무시하고 있다가 특정 시간이 지나면 인식

```js
this.$input = document.getElementById('input');
this.$input.addEventListener('input', event => delayListenEvent(event, handleInput.bind(this), 1000));

function handleInput() {
  const { value } = this.$input;
  console.log('HandleInput: ', value);
}

function delayListenEvent(event, callback, ms) {
  console.log('delayListenEvent', event.target.value);
  setTimeout(() => {
    // debugger;
    callback(event);
  }, ms);
}
```

입력값: 1 -> 2 -> 3
출력결과: callback 함수안에서 특정 시간 뒤에 원하는 값이 출력되지만 이벤트가 발생한 만큼 callback이 실행된다.

```
delayListenEvent 1
delayListenEvent 12
delayListenEvent 123
HandleInput:  123
HandleInput:  123
HandleInput:  123
```

### 1번 시도의 문제점

- `this.$input.addEventListener('input', (event) => {})` 원래는 이런 구조로 사용해야 한다. 따라서 event를 인자로 넘겨주지 말고 delayListenEvent가 `(event) => void` 구조를 반환하게 만들기

## 2번 시도: 함수를 반환하는 함수 활용

delayListenEvent가 이벤트 핸들러((event) => {} 구조의 함수)를 반환하도록 구성하기

```js
this.$input = document.getElementById('input');
this.$input.addEventListener('input', delayListenEvent(handleInput, 1000));

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleInput(event) {
  console.log('3. HandleInput: ', event.target.value);
}

function delayListenEvent(callback, ms) {
  console.log('1. delayListenEvent');
  return function (event) {
    console.log('2. event.target.value', event.target.value);
    setTimeout(() => {
      // debugger;
      callback(event);
    }, ms);
  };
}
```

입력값: 1 -> 2 -> 3
출력결과: 이벤트를 등록할 때 1번 log 출력 -> 이벤트가 발생하다마다 2번 출력 -> 각 이벤트마다 1000ms뒤에 3번 실행

```md
delayListenEvent
event.target.value: 1
event.target.value: 12
event.target.value: 123
HandleInput: 123
HandleInput: 123
HandleInput: 123
```

### 2번 시도의 문제점

- setTimeout을 사용해서 callback 함수를 Task Queue에 쌓아준다. 1초 뒤에 callback함수가 실행되지만, event가 발생할 때마 Task Queue에 쌓기 때문에 3번 실행된다.

## 3번 시도: debounce와 throttle에 대한 개념을 찾아보고 적용

## debounce

> 이벤트를 `그룹화`(Grouping)하여, `연이어 호출되는 함수들 중 마지막 함수만 호출`하도록 하는 기술

```js
this.$input.addEventListener('input', debounce(handleInput, 500));

function handleInput(event) {
  console.log('HandleInput: ', event.target.value);
  console.log(this); // $input
}

function debounce(callback, delay = 0) {
  let timeoutId = null;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, arguments), delay);
  };
}
```

코드 설명

- callback(): 실행대상
- delay 시간 이내에 함수가 반복 호출될 경우 clearTimeout으로 timeoutId를 지움
- timeoutId는 상위 컨텍스트이기 때문에 기억되고 있음
- apply로 callback이 실행될 때의 컨텍스트의 this를 callback에 묶기
- arguments 함수의 arguments객체를 그대로 전달

### debounce와 클로져

debounce는 클로저를 사용하여 구현할 수 있다. debounce 내부에서 타이머(timeoutId)를 생성하고, 타이머 변수를 실행 컨텍스트와 함께 유지할 수 있다. 타이머에 등록된 일정 시간이 경과된 뒤 callback함수를 실행할 때, 클로져를 사용해 원본 함수에 전달되는 인자나 this를 유지할 수 있다.

debounce에서 클로져를 사용하는 핵심 이유는 클로져를 통해 이전 상태를 기억하고 다음에 함수가 호출될 때 사용(access)할 수 있기 때문이다. timeoutId가 등록된 컨텍스트를 기억하고, 이를 통해 함수가 자주 호출되더라도 마지막 호출 이후 일정 시간이 경과한 후에만 실행하도록 할 수 있다.

### 추가적인 매개변수를 함께 전달하기

```js
this.$input.addEventListener(
  'input',
  debounce(event => handleInput(event, '위에서 넘기기'), 500),
);
function handleInput() {
  console.log(arguments); // Arguments(2) [InputEvent, '위에서 넘기기', callee: (...), Symbol(Symbol.iterator): ƒ]
  console.log(this); // undefined
}
```

### 이벤트를 등록할 때의 this를 함께 전달하기

```js
this.$input.addEventListener('input', debounce(handleInput.bind(this), 500));

function handleInput() {
  console.log(arguments); // Arguments [InputEvent, callee: (...), Symbol(Symbol.iterator): ƒ]
  console.log(this); // InputHandler {$input: input#input}
}
```

### this와 매개변수 둘다 넘기기

```js
this.$input.addEventListener(
  'input',
  debounce(event => {
    handleInput.call(this, event, '위에서 넘기기');
  }, 500),
);
function handleInput() {
  console.log(arguments); // Arguments(2) [InputEvent, '위에서 넘기기', callee: (...), Symbol(Symbol.iterator): ƒ]
  console.log(this); //InputHandler {$form: form#form, $input: input#input}
}
```

### 🤔 event는 어디있니?

> event는 자동으로 함수에 전달됨. addEventListener에 전달하는 함수의 첫 번째 인수로 지정하기만 하면 됨. 또한 `false`는 capture parameter의 기본값

event는 자동으로 함수에 전달되기 때문에 arguments에 포함되어 있다.

```js
function debounce(callback, delay = 0) {
  let timeoutId = null;
  return function (event) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    console.log(event); // 해당 이벤트

    console.log(arguments); // Arguments [InputEvent, callee: (...), Symbol(Symbol.iterator): ƒ]
    console.log(this); // addEventListener의 this(여기서는 input태그)
    timeoutId = setTimeout(() => callback.apply(this, arguments), delay);
  };
}
```

#### Use the rest parameters instead of 'arguments'.

[Use the rest parameters instead of 'arguments'.](https://eslint.org/docs/latest/rules/prefer-rest-params)라는 린트에러를 참고하면 `arguments`는 Array.prototype이 없어서 불편해서 `...args`를 추천한다.

```js
this.$input.addEventListener('input', debounce(handleInput.bind(this), 500));

function handleInput(event) {
  console.log('HandleInput: ', event.target.value);
  console.log(this); // $input
}
function debounce(callback, delay = 0) {
  let timeoutId = null;
  return function (...args) {
    console.log('timeoutId', timeoutId);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), delay);
  };
}
```

#### Arrow function에서 this

일반함수 에서의 this는 호출될 때(동적으로 현재 실행되는 컨텍스트에 따라서) 어떤 객체가 될지 결정된다. 선언되는 시점이 아니라 함수가 실행되는 시점의 바인딩 방법에 따라 this가 결정된다.

하지만 화살표 함수(arrow function)는 함수를 선언할 때 this에 바인딩할 객체가 정적으로 결정된다. 동적으로 결정되는 일반 함수와는 달리 화살표 함수의 this 언제나 상위 스코프의 this를 가리킨다. 따라서 아래처럼 debounce의 return 문을 화살표 함수로 작성하면 이벤트 등록함수에서 this는 이벤트가 등록된 DOM이 아닌 다른 곳을 가리키지 않는다.

```js
this.$input.addEventListener('input', debounce(handleInput.bind(this), 500));

function handleInput(event) {
  console.log('HandleInput: ', event.target.value);
  console.log(this); // window
}

function debounce(callback, delay = 0) {
  let timeoutId = null;
  return (...args) => {
    console.log('timeoutId', timeoutId);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), delay);
  };
}
```

## throttle

> 일정 시간 내에 한 번만 함수를 호출하도록 하는 기술로, 디바운스와 가장 큰 차이점이라면 `정해진 시간 간격 내에 반드시 최대 한 번 함수가 호출`

검색창 자동완성을 예로 들면 디바운스와는 달리 입력이 진행 중임에도 자동완성 추천이 나타난다. 핵심적인 내용은 debounce와 같기 때문에 자세한 설명은 생략한다.

```js
function throttle(callback, delay) {
  let lastExecTime = 0; // 마지막 실행시간
  let timeoutId;
  return function () {
    const now = Date.now();
    const timeSinceLastExec = now - lastExecTime;
    if (timeSinceLastExec < delay) {
      // 정해진 시간 내에 내에 return함수가 실행되었다면 if문 실행
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastExecTime = now;
        func.apply(context, args);
      }, delay - timeSinceLastExec);
    } else {
      // 정해진 시간 외에 return함수가 실행되었다면 if문 실행
      lastExecTime = now;
      func.apply(context, args);
    }
  };
}
```

코드 설명:

## 참고자료

- https://www.zerocho.com/category/JavaScript/post/59a8e9cb15ac0000182794fa
- 자바스크립트 딥다이브
- https://css-tricks.com/debouncing-throttling-explained-examples/
