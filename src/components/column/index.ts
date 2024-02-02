import Base from '@components/base'

import './index.scss'

export default class Column extends Base<HTMLDivElement> {
  constructor(...nodes: (string | Node)[]) {
    super(document.createElement('div'))

    this._root.append(...nodes)
    this.init()
  }

  private init() {
    this._root.classList.add('prowler-column-wrapper')
  }
}
