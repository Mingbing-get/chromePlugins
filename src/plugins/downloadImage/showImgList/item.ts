import Base from '@components/base'
import Icon from '@components/icon'
import Popover from '@components/popover'

import Listener from '@utils/listener'

export function createImgName(src: string, alt?: string) {
  return alt || src.split('/').pop() || `${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`
}

export default class Item extends Base<HTMLDivElement> {
  private listener = new Listener()
  private errorIcon = new Icon('error')

  private src: string
  private alt?: string
  private error?: boolean

  name: string

  constructor(src: string, alt?: string) {
    super(document.createElement('div'))

    this.src = src
    this.alt = alt
    this.name = createImgName(src, alt)

    this.init()
  }

  private init() {
    this._root.setAttribute('class', 'show-img-item')

    const img = document.createElement('img')
    img.src = this.src
    img.setAttribute('class', 'show-img-item-img')
    img.addEventListener('click', () => {
      this.listener.trigger('onClickImage', this.src, this.name)
    })

    const actionGroup = document.createElement('div')
    actionGroup.setAttribute('class', 'show-img-item-actions')

    const downloadDom = document.createElement('a')
    downloadDom.href = this.src
    downloadDom.download = this.name
    downloadDom.innerText = '下载'
    downloadDom.classList.add('show-img-item-download')

    const deleteIcon = new Icon('delete')
    deleteIcon.root().classList.add('show-img-item-delete')
    deleteIcon.root().addEventListener('click', () => {
      this.listener.trigger('onRemove')
    })

    this.errorIcon.root().classList.add('show-img-item-error')
    new Popover(this.errorIcon.root(), '下载失败', { trigger: 'hover', placement: 'top' })

    actionGroup.append(downloadDom, deleteIcon.root(), this.errorIcon.root())

    this._root.append(img, actionGroup)
  }

  setError(bool: boolean = true) {
    this.error = bool

    this.errorIcon.root().style.display = 'inline-block'
    return this
  }

  onRemove(fn: () => void) {
    this.listener.add('onRemove', fn)
  }

  onClickImage(fn: (src: string, name: string) => void) {
    this.listener.add('onClickImage', fn)
  }
}
