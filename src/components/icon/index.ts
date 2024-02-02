import Base from '@components/base'
import path from './path'

import './index.scss'

export type IconType = keyof typeof path

export const pathKeys = Object.keys(path) as IconType[]

export default class Icon extends Base<SVGSVGElement> {
  _type: IconType = 'add'

  constructor(type: IconType = 'add') {
    const SVG_NS = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(SVG_NS, 'svg')
    svg.setAttribute('class', 'prowler-icon')
    svg.setAttribute('viewBox', '0 0 1024 1024')
    svg.setAttribute('version', '1.1')
    svg.setAttribute('xmlns', SVG_NS)

    super(svg)

    this.setType(type)
  }

  setType(type: IconType) {
    this._type = type
    this._root.innerHTML = path[type]
  }
}
