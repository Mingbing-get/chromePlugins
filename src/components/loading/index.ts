import Icon from '@components/icon'
import Base from '@components/base'

import './index.scss'

export default class Loading extends Base<HTMLDivElement> {
  constructor() {
    super(document.createElement('div'))

    this.init()
  }

  private init() {
    const loadingIcon = new Icon('loading')
    loadingIcon.root().classList.add('prowler-loading-icon')

    this._root.setAttribute('class', 'prowler-loading-wrapper')
    this._root.append(loadingIcon.root())
  }
}
