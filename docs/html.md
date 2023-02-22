# custom innerHTML만들기

## 목표

- 일반 dom을 반환
- Child Component 지원 ${} 안에다가 DOM Object 삽입 가능(해당 함수로 만든 결과도 삽입 가능)
- map 사용 가능(react처럼)
- innerHTML과 차이

## Node vs HtmlElement

### Node란?

`Node`는 보다 일반적인 Element이다. 노드는 HTML element일 수 있지만 텍스트나 주석과 같은 HTML 문서의 다른 모든 것일 수도 있다. 아래 예시를 보자.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Document</title>
  </head>
  <body>
    <!-- Comment -->
    <div id="root"></div>
    <p>This is Example</p>
  </body>
</html>
```

위와 같은 구조에서 \<html>은 DOM document의 노드이다. \<html>은 \<head>와 \<body>라는 두 개의 자식 노드를 가진다. /<body>는 주석 노드와 \<div id="root"> 노드와 \<p>노드를 가진다.

\<p> 노드도 자식 노드를 가지는데, 문자열(text) 또한 노드로 취급한다.

MDN의 `Node` 설명에 따르면 다음의 인터페이스들은 모두 Node로부터 메소드와 프라퍼티를 상속한다고 한다.

- Element Node
- Text Node
- CData Section Node
- Processing Instruction Node
- Comment Node
- Document Node
- Document Type Node
- Document Fragment Node

### Element (HTMLElement)

위에서 살펴봤듯이 Element는 Node의 특정 타입 중 하나다.(Node.ELEMENT_NODE) Element는 HTML 문서에서 태그를 사용하여 작성된 노드이다. 예를 들어, HTMLElement 인터페이스는 HTML 요소의 기반 인터페이스이고 SVGElement (en-US) 인터페이스는 모든 SVG 요소의 기초이다.

정리하자면, `Node`는 `Element`를 포함한 개념이며, `Element`는 `HTMLElement`를 포함한 개념이다.

```ts
const paragraph = document.querySelector('p');
paragraph instanceof Node; // => true
paragraph instanceof HTMLElement; // => true
```

### DOM 프로퍼티 구분

node에만 있는 DOM 프로퍼티와 element에만 있는 DOM 프로퍼티를 구분할 줄 알아야 한다.

다음 Node의 프로퍼티들은 node나 NodeList를 평가하는 프로퍼티들이다.

```ts
node.parentNode; // Node or null
node.firstChild; // Node or null
node.lastChild; // Node or null
node.childNodes; // NodeList
```

다음의 프로퍼티들은 element나 element collection을 평가하는 프로퍼티들이다.

```ts
node.parentElement; // HTMLElement or null
node.children; // HTMLCollection
```

`node.childNodes`나 `node.children`모두 노드의 자식요소를 반환하지만 차이가 있다. `childNodes`는 노드의 프로퍼티이기 떄문에 모든 하위 노드를 반환하지만 `children`은 element이기 떄문에 하위 노드 중 element가 아닌 노드는 반환하지 않는다.

```html
<p>
  hello example <abc>custom abc tag</abc>
  <!-- comment -->
</p>
```

[데모 링크](https://codesandbox.io/s/htmlelement-6nlvrm?file=/index.html)

```ts
const paragraph = document.querySelector('p');
console.log(paragraph.childNodes); // NodeList (5):
// 0 " hello example "
// 1 <abc>custom abc tag</abc>
// 2 #text " "
// 3 <!-- comment -->
// 4 #text " "
console.log(paragraph.children); // HTMLCollection (1)
// 0 <abc>custom abc tag</abc>
```

## Template

### 특징

HTML `<template>` 요소는 페이지를 불러온 순간 즉시 그려지지는 않지만, 이후 JavaScript를 사용해 인스턴스를 생성할 수 있는 HTML 코드를 담을 방법을 제공한다.

`<template>`안에 작성한 코드는 document 구조 밖(out of document)으로 인식한다. template은 활성화 될 떄까지 비활성화상태를 유지하며 마크 업은 DOM에 숨겨져 있어 렌더링되지 않는다. 예를 들어, template이 활성화되기 전 기본 페이지에서 getElementById 또는 querySelector를 사용하면 템플릿의 하위 노드가 반환되지 않는다.

`<template>`을 활성화하는 방법 중 가장 간단한 방법은 document.importNode()를 사용하여 .content의 심층 복사본을 만드는 것이다. .content 속성은 템플릿의 내장을 포함하는 읽기 전용 DocumentFragment이다.

```js
var t = document.querySelector('#mytemplate');
// Populate the src at runtime.
t.content.querySelector('img').src = 'logo.png';

var clone = document.importNode(t.content, true);
document.body.appendChild(clone);
```

혹은 아래와 같이 cloneNode를 사용하여 content를 반환할 수 있다. (cloneNode(true): deep copy가능하게 하는 옵션)

```ts
export const html = (html: TemplateStringsArray, ...children: HTMLElement[]): HTMLElement => {
  const template = document.createElement('template');
  template.innerHTML = html.join('');
  return template.content.cloneNode(true) as HTMLElement;
};
```

### 장점

- template이 활성화될 때까지 효과적으로 비활성화된다. 기본적으로 마크업은 숨겨진 DOM이며 렌더링되지 않는다.
- template 내의 내용은 side effect가 없다. template을 사용할 때까지 스크립트가 실행되지 않고, 이미지가 로드되지 않으며, 오디오가 재생되지 않는다.
- shadowDOM을 만들 때, innerHTML보다 장점이 있다. (shadowDOM이 어떤 기술인지 잘 모르겠지만 template이 활성화되기 전까지 접근하지 못해서 생기는 장점과 같은 맥락인 듯하다.)

## DocumentFragment

DocumentFragments 는 DOM 노드들 이다. DocumentFragments 메인 DOM 트리의 일부가 되지 않는다. DocumentFragment는 기본적으로 DOM과 동일하게 동작하지만, HTML의 DOM 트리에는 영향을 주지 않으며, 메모리에서만 정의된다.

DocumentFragments는 활성화된 DOM이 아니고, 메모리에만 존재한다. 그렇기 때문에 DocumentFragments를 변경해도 DOM 구조는 변경되지 않기 때문에 브라우저가 화면을 다시 렌더링하지 않는다. 그렇기 때문에fragment에 가하는 변경사항은 DOM에 영향을 주지 않고, 성능에 큰 영향을 미치지 않는다. 예를 들어, `DocumentFragments에 자식들을 추가하는 것은 페이지 reflow(엘리먼트의 위치와 좌표의 계산)를 유발하지 않는다.`

일반적인 유즈 케이스는 다큐먼트 조각을 생성하고, 엘리먼트들을 다큐먼트 조각에 추가하고 그 다큐먼트 조각을 DOM 트리에 추가하는 것입니다. DOM 트리 내에서 다큐먼트 조각은 그것의 모든 자식들로 대체됩니다.

- template도 template.content 속성에 DocumentFragment를 가지고 있다.
- DOM 서브트리를 조립해서 DOM에 삽입하기 위한 용도로 사용됨

## outerHTML vs innerHTML

### outerHTML

- outerHTML에서 지정한 요소 태그도 포함하여 값을 가져온다.
- 선택한 엘리먼트를 포함해서 처리
- 자기자신 포함

```js
// HTML:
// <div id="d"><p>Content</p><p>Further Elaborated</p></div>

d = document.getElementById('d');
console.log(d.outerHTML);

// '<div id="d"><p>Content</p><p>Further Elaborated</p></div>'
// 위 문자열이 콘솔창에 출력됩니다.
```

### innerHTML

- innerHTML에서 지정한 요소 태그를 제외한 안쪽 태그만 값을 가져온다
- 자기자신 미포함

## 참고 자료

- https://www.typescriptlang.org/ko/docs/handbook/dom-manipulation.html
- https://typescript-kr.github.io/pages/tutorials/dom-manipulation.html
- https://developer.mozilla.org/ko/docs/Web/HTML/Element/template
- https://ko.javascript.info/template-element
- https://ui.toast.com/posts/ko_20170901#template-element
- https://web.dev/webcomponents-template/
- https://developer.mozilla.org/ko/docs/Web/API/Document/createDocumentFragment
- https://developer.mozilla.org/ko/docs/Web/API/HTMLElement
- https://developer.mozilla.org/ko/docs/Web/API/Node/cloneNode
- https://7942yongdae.tistory.com/70
- https://developer.mozilla.org/ko/docs/Web/API/Element/outerHTML
- https://dmitripavlutin.com/dom-node-element/
- https://bitsofco.de/what-exactly-is-the-dom/?utm_source=CSS-Weekly&utm_campaign=Issue-341&utm_medium=email
