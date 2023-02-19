type Arg = string | number | HTMLElement | DocumentFragment

export const dom = (template: TemplateStringsArray, ...args: Arg[]): HTMLElement => {
  const container = document.createElement('template')

  const replaceTypeToString = (arg: Arg) => {
    if (typeof arg === 'string') {
      return arg
    } else if (typeof arg === 'number') {
      return `${arg}`
    }
    return ''
  }

  const serializeToString = (node: Node): string => {
    const serializer = new XMLSerializer()
    return serializer.serializeToString(node)
  }

  const convertToString = (fragment: DocumentFragment): string => {
    const container = document.createElement('div')
    container.appendChild(fragment.cloneNode(true))
    return container.innerHTML
  }

  const nodes = args.map(arg => {
    if (arg instanceof DocumentFragment) {
      return convertToString(arg)
    } else if (arg instanceof Node) {
      return serializeToString(arg)
    } else {
      return replaceTypeToString(arg)
    }
  })
  container.innerHTML = String.raw(template, ...nodes)
  return container.content.cloneNode(true) as HTMLElement
}

export type BaseNode = DocumentFragment | Document | Element | HTMLElement

export const $ = <T extends Element>(selector: string, base: BaseNode = document) => base.querySelector(selector) as T

export const $$ = <T extends Element>(selector: string, base: BaseNode = document) =>
  [...base.querySelectorAll(selector)] as T[]
