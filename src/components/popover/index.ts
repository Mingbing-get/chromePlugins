import PopoverHandle from '@components/popoverHandle'
import Listener from '@utils/listener'

import { PopoverHandleOptions, ArrowSize } from '../popoverHandle/type'
import { PopoverOptions } from './type'

export default class Popover {
  private _listener: Listener
  private _handle: PopoverHandle
  private _options: Omit<PopoverOptions, keyof PopoverHandleOptions>

  private _target: HTMLElement | SVGSVGElement
  private _content: Node | string

  private counter = 0
  private isHover = false
  private hoverTimer?: number | NodeJS.Timeout

  constructor(target: HTMLElement | SVGSVGElement, content: Node | string, options?: PopoverOptions) {
    this._listener = new Listener()
    this._handle = new PopoverHandle({
      arrowSize: options?.arrowSize,
      placement: options?.placement,
      widthFollowTarget: options?.widthFollowTarget,
      offset: options?.offset,
    })
    this._handle.root().append(content)
    if (options?.visible) {
      this._handle.setTarget(target)
    }

    this._options = {
      trigger: options?.trigger || 'click',
      visible: options?.visible,
      preventControlVisible: options?.preventControlVisible,
      delay: options?.delay || 500,
      hoverOpenDelay: options?.hoverOpenDelay || 0,
    }
    this._target = target
    this._content = content
    this.bindTargetEvent()

    this.init()
  }

  private init() {
    this.addVisibleControl()

    if (this._options.trigger !== 'hover' || this._options.preventControlVisible) return

    const handleMouseenter = () => {
      this.counter++
      this.setVisible(true)
      setTimeout(() => {
        this.counter--
      }, this._options.delay)
    }

    const handleMouseleave = () => {
      setTimeout(() => {
        if (this.counter === 0) this.setVisible(false)
      }, this._options.delay)
    }

    this._handle.root().addEventListener('mouseenter', handleMouseenter)
    this._handle.root().addEventListener('mouseleave', handleMouseleave)
  }

  private domInDisplayOrTarget(dom: Node) {
    let curNode: Node | null = dom
    let flag = false

    while (curNode) {
      if (curNode === this._handle.root() || curNode === this._target) {
        flag = true
        break
      }
      curNode = curNode.parentNode
    }

    return flag
  }

  private addVisibleControl() {
    if (this._options.preventControlVisible) return

    const clickHandle = (e: MouseEvent) => {
      if (!['click', 'focus'].includes(this._options.trigger || 'click')) return

      if (this.domInDisplayOrTarget(e.target as Node)) return

      this.setVisible(false)
    }

    const handleMouseMove = (e: MouseEvent) => {
      // 模拟mouse leave
      if (!this.isHover) return

      if (this.domInDisplayOrTarget(e.target as Node)) return

      this.isHover = false
      clearTimeout(this.hoverTimer)
      setTimeout(() => {
        if (this.counter === 0) {
          this.setVisible(false)
        }
      }, this._options.delay)
    }

    document.body.addEventListener('click', clickHandle)
    document.body.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.body.removeEventListener('click', clickHandle)
      document.body.removeEventListener('mousemove', handleMouseMove)
    }
  }

  private toggleVisible(e: MouseEvent) {
    this.setVisible(!this._options.visible)
    e.stopPropagation()
    return false
  }

  private bindTargetEvent() {
    if (this._options.preventControlVisible) return

    const handleMouseenter = () => {
      this.isHover = true
      this.hoverTimer = setTimeout(() => {
        this.counter++
        this.setVisible(true)
        setTimeout(() => {
          this.counter--
        }, this._options.delay)
      }, this._options.hoverOpenDelay)
    }

    if (this._options.trigger === 'click') {
      this._target.onclick = (e) => this.toggleVisible(e)
    } else if (this._options.trigger === 'hover') {
      this._target.onmouseenter = handleMouseenter
    } else if (this._options.trigger === 'focus') {
      this._target.onfocus = () => this.setVisible(true)
      this._target.onclick = (e) => e.stopPropagation()
    }
  }

  setVisible(visible?: boolean) {
    this._options.visible = visible

    if (visible) {
      this._handle.setTarget(this._target)
    } else {
      this._handle.setTarget()
    }

    this._listener.trigger('changeVisible', !!visible)

    return this
  }

  setContent(content: Node | string) {
    this._content = content
    this._handle.root().append(content)
    this._handle.getInstance().forceUpdate()

    return this
  }

  setPlacement(placement: Required<PopoverHandleOptions>['placement']) {
    this._handle.setPlacement(placement)
    return this
  }

  setOffset(offset?: PopoverHandleOptions['offset']) {
    this._handle.setOffset(offset)
    return this
  }

  setArrowSize(arrowSize: ArrowSize) {
    this._handle.setArrowSize(arrowSize)
    return this
  }

  setWidthFollowTarget(widthFollowTarget?: PopoverHandleOptions['widthFollowTarget']) {
    this._handle.setWidthFollowTarget(widthFollowTarget)
    return this
  }

  onChangeVisible(fn: (visible: boolean) => void) {
    this._listener.add('changeVisible', fn)
  }
}
