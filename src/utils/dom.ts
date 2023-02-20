export type BaseNode = DocumentFragment | Document | Element | HTMLElement;

type Arg = Array<BaseNode> | BaseNode | string | number;

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

const combineNodes = (nodes: Array<BaseNode>): string => {
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

export const html = (template: TemplateStringsArray, ...args: Arg[]): HTMLElement => {
  const nodes = args.map(arg => (arg instanceof Array ? combineNodes(arg) : replaceTypeToString(arg)));
  const container = document.createElement('template');
  container.innerHTML = String.raw(template, ...nodes);
  return container.content.cloneNode(true) as HTMLElement;
};

export const $ = <T extends Element>(selector: string, base: BaseNode = document) => base.querySelector(selector) as T;

export const $$ = <T extends Element>(selector: string, base: BaseNode = document) =>
  [...base.querySelectorAll(selector)] as T[];
