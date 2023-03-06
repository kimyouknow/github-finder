export type BaseNode = DocumentFragment | Document | Element | HTMLElement;

type Arg = Array<BaseNode | string> | BaseNode | string | number;

const convertArgToString = (arg: Arg) => (arg instanceof HTMLElement ? arg.outerHTML : arg);

const combineArgToString = (arg: Arg) =>
  arg instanceof Array ? arg.map(convertArgToString).join('') : convertArgToString(arg);

export const htmlDom = (template: TemplateStringsArray, ...args: Arg[]): HTMLElement => {
  const nodes = args.map(combineArgToString);
  const container = document.createElement('template');
  container.innerHTML = String.raw(template, ...nodes);
  return container.content.firstChild?.cloneNode(true) as HTMLElement;
};

export const html = (template: TemplateStringsArray, ...args: Arg[]): string => {
  const nodes = args.map(combineArgToString);
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
