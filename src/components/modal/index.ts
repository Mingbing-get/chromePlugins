import indexManager from '@utils/indexManager'
import Listener from '@utils/listener'
import { sliceClass } from '@utils/helper'
import Base from '@components/base'
import Icon from '@components/icon'

import { ModalPosition } from './type'

import './index.scss'

export default class Modal extends Base<HTMLElement> {
  private _header: HTMLElement
  private _headerContent: HTMLElement
  private _body: HTMLElement
  private _footer: HTMLElement

  private _closeIcon?: Node
  private _container: HTMLElement
  private listener: Listener

  _showClose: boolean = false
  _visible: boolean = false
  _position: ModalPosition = 'center'

  constructor() {
    super(document.createElement('div'))
    this._header = document.createElement('div')
    this._headerContent = document.createElement('div')
    this._header.append(this._headerContent)
    this._body = document.createElement('div')
    this._footer = document.createElement('div')
    this._container = document.body
    this.listener = new Listener()

    this.init()
  }

  private init() {
    this._root.append(this._body)
    this._root.classList.add('prowler-modal-wrapper', 'position-center')
    this._header.classList.add('prowler-modal-header')
    this._headerContent.classList.add('prowler-modal-header-content')
    this._body.classList.add('prowler-modal-body')
    this._footer.classList.add('prowler-modal-footer')
  }

  setContainer(container?: HTMLElement) {
    this._container = container || document.body

    return this
  }

  open() {
    this._visible = true
    this._root.style['zIndex'] = `${indexManager.getIndex()}`
    this._container.appendChild(this._root)

    this.listener.trigger('open')
    this.listener.trigger('changeVisible', true)

    return this
  }

  close() {
    this._visible = false
    this._container.removeChild(this._root)

    this.listener.trigger('close')
    this.listener.trigger('changeVisible', false)

    return this
  }

  onOpen(fn: () => void) {
    this.listener.add('open', fn)

    return this
  }

  onClose(fn: () => void) {
    this.listener.add('close', fn)

    return this
  }

  onChangeVisible(fn: (visible: boolean) => void) {
    this.listener.add('changeVisible', fn)

    return this
  }

  showClose(bool: boolean = true) {
    this._showClose = bool
    if (bool) {
      if (!this._root.contains(this._header)) {
        this._root.insertBefore(this._header, this._body)
      }
      if (!this._closeIcon) {
        const closeIcon = new Icon('close')
        closeIcon.root().classList.add('prowler-modal-close')
        closeIcon.root().addEventListener('click', () => {
          this.close()
        })

        this._closeIcon = closeIcon.root()
      }
      if (!this._header.contains(this._closeIcon)) {
        this._header.appendChild(this._closeIcon)
      }
    } else if (this._closeIcon) {
      this._header.removeChild(this._closeIcon)
    }
  }

  setPosition(position: ModalPosition = 'center') {
    this._position = position
    const allPositions: `position-${ModalPosition}`[] = [
      'position-bottom-center',
      'position-center',
      'position-left-bottom',
      'position-left-center',
      'position-left-top',
      'position-right-bottom',
      'position-right-center',
      'position-right-top',
      'position-top-center',
    ]

    sliceClass(this._root, allPositions, [`position-${position}`])

    return this
  }

  getHeader() {
    if (!this._root.contains(this._header)) {
      this._root.insertBefore(this._header, this._body)
    }
    return this._headerContent
  }
  getBody() {
    return this._body
  }
  getFooter() {
    if (!this._root.contains(this._footer)) {
      this._root.appendChild(this._footer)
    }
    return this._footer
  }
}
