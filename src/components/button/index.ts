import { sliceClass, toggleClass } from '@utils/helper'
import Base from '@components/base'
import Loading from '@components/loading'

import { ButtonType } from './type'

import './index.scss'

export type { ButtonType }

export default class Button extends Base<HTMLButtonElement> {
  private loadingInstance?: Base<any>

  _type: ButtonType = 'default'
  _ghost: boolean = false
  _disabled: boolean = false
  _loading: boolean = false
  _round: boolean = false
  _block: boolean = false

  constructor(...nodes: (string | Node)[]) {
    super(document.createElement('button'))

    this._root.append(...nodes)
    this.init()
  }

  private init() {
    this._root.classList.add('prowler-button-wrapper', 'type-default')
  }

  setType(type: ButtonType) {
    this._type = type
    const typeList: `type-${ButtonType}`[] = ['type-danger', 'type-default', 'type-primary', 'type-success', 'type-warning']
    sliceClass(this._root, typeList, [`type-${type}`])
    return this
  }

  setGhost(bool: boolean = true) {
    this._ghost = bool
    toggleClass(this._root, 'is-ghost', bool)
    return this
  }
  setDisabled(bool: boolean = true) {
    this._disabled = bool
    this.changeDisabled(bool)
    toggleClass(this._root, 'is-disabled', bool)
    return this
  }
  setLoading(bool: boolean = true) {
    this._loading = bool
    if (bool) {
      if (!this.loadingInstance) {
        this.loadingInstance = new Loading()
        this.loadingInstance.root().classList.add('prowler-button-loading')
      }

      this._root.appendChild(this.loadingInstance?.root())
    } else {
      if (this.loadingInstance) {
        this._root.removeChild(this.loadingInstance.root())
      }
    }

    this.changeDisabled(bool)
    toggleClass(this._root, 'is-loading', bool)
    return this
  }
  setRound(bool: boolean = true) {
    this._round = bool
    toggleClass(this._root, 'is-round', bool)
    return this
  }
  setBlock(bool: boolean = true) {
    this._block = bool
    toggleClass(this._root, 'is-block', bool)
    return this
  }

  private changeDisabled(bool: boolean) {
    if (bool) {
      this._root.disabled = true
    } else {
      this._root.disabled = false
    }
  }
}
