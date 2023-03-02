export type BaseNode = DocumentFragment | Document | Element | HTMLElement;

type Arg = Array<BaseNode | string> | BaseNode | string | number;

export const convertNodeToString = (element: Node): string => {
  return element.nodeValue || '';
};

export const convertDFToString = (fragment: BaseNode): string => {
  const container = document.createElement('div');
  container.appendChild(fragment.cloneNode(true));
  return container.innerHTML;
};

const replaceTypeToString = (arg: Arg) => {
  if (typeof arg === 'string') {
    return arg;
  } else if (typeof arg === 'number') {
    return `${arg}`;
  } else if (arg instanceof DocumentFragment) {
    return convertDFToString(arg);
  } else if (arg instanceof Node) {
    return convertNodeToString(arg);
  }
  return '';
};

const combineNodes = (nodes: Array<BaseNode | string>): string => {
  const fragment = document.createDocumentFragment();
  nodes.forEach(node => {
    if (node instanceof DocumentFragment) {
      fragment.appendChild(node);
    } else {
      const container = document.createElement('div');
      container.innerHTML = replaceTypeToString(node);
      fragment.appendChild(container.firstChild as Node);
    }
  });
  return convertDFToString(fragment);
};

export const htmlDom = (template: TemplateStringsArray, ...args: Arg[]): HTMLElement => {
  const nodes = args.map(arg =>
    arg instanceof Array ? combineNodes(arg) : replaceTypeToString(arg),
  );
  const container = document.createElement('template');
  container.innerHTML = String.raw(template, ...nodes);
  return container.content.firstElementChild?.cloneNode(true) as HTMLElement;
};

export const html = (template: TemplateStringsArray, ...args: Arg[]): string => {
  const nodes = args.map(arg =>
    arg instanceof Array ? combineNodes(arg) : replaceTypeToString(arg),
  );
  return String.raw(template, ...nodes);
};

export const $ = <T extends Element>(selector: string, base: BaseNode = document) =>
  base.querySelector(selector) as T;

export const $$ = <T extends Element>(selector: string, base: BaseNode = document) =>
  [...base.querySelectorAll(selector)] as T[];

export const render = <T extends Element, S extends any[]>(
  $component: T,
  view: (...args: any[]) => string,
  ...args: S
) => {
  const newDom = htmlDom`${view(...args)}`;
  $component.replaceWith(newDom);
  // window.requestAnimationFrame(() => {});
  // FIXME 2번째과정이 새로운 view에 적용되지 않는 문제: render()호출 -> dom 탐색 후 class 및 css 변경 -> requestAnimationFrame의 cb 실행
};
