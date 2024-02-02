import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import Base from '@components/base'
import Button from '@components/button'
import Modal from '@components/modal'

import Item, { createImgName } from './item'

import './index.scss'

export interface ImgInfo {
  src: string
  alt?: string
  error?: boolean
}

export default class ShowImgList extends Base<HTMLDivElement> {
  private srcList: ImgInfo[]

  private imgListContainer: HTMLDivElement
  private imgPreviewModel = new Modal()

  constructor() {
    super(document.createElement('div'))

    this.imgListContainer = document.createElement('div')
    this.srcList = []

    this.init()
  }

  private init() {
    this._root.setAttribute('class', 'show-img-list')
    this.imgListContainer.setAttribute('class', 'show-img-list-list')

    const downloadAllBtn = new Button('全部下载')
    downloadAllBtn.setBlock(true).setType('primary')
    downloadAllBtn.root().addEventListener('click', async () => {
      downloadAllBtn.setLoading(true)
      await this.downloadAll()
      downloadAllBtn.setLoading(false)
    })

    this.imgPreviewModel.showClose(true)
    this._root.append(this.imgListContainer, downloadAllBtn.root())
  }

  private async downloadAll() {
    if (!this.srcList.length) return
    const folderName = `prowler-${new Date().getTime()}`

    const zip = new JSZip()
    const images = zip.folder(folderName)

    const errorList: ImgInfo[] = []
    await Promise.all(
      this.srcList.map((item) =>
        (async () => {
          try {
            const imgBlob = await this.getImageBlob(item.src)

            const ext = imgBlob.type.split('/')[1]
            images?.file(`${createImgName(item.src, item.alt)}${ext ? `.${ext}` : ''}`, imgBlob)
          } catch (error) {
            errorList.push(item)
            item.error = true
          }
        })()
      )
    )

    if (errorList.length > 0) {
      this.setSrcList(this.srcList)
    }
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `${folderName}.zip`)
  }

  private getImageBlob(src: string) {
    return new Promise<Blob>((resolve, reject) => {
      const img = document.createElement('img')
      img.src = src
      img.setAttribute('style', 'opacity: 0; z-index: -100000000; position: absolute; top: -100000px')
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          img.remove()
          reject('创建canvas失败')
          return
        }

        ctx.drawImage(img, 0, 0, img.width, img.height)
        try {
          canvas.toBlob((blob) => {
            img.remove()
            if (!blob) {
              reject('转换失败')
            } else {
              resolve(blob)
            }
          })
        } catch (error) {
          reject(error)
        }
      }
      document.body.append(img)
    })
  }

  setSrcList(srcList: ImgInfo[]) {
    this.srcList = srcList

    const newImgContainer = document.createElement('div')
    newImgContainer.setAttribute('class', 'show-img-list-list')
    srcList.forEach((item) => {
      const imgItem = new Item(item.src, item.alt)
      imgItem.onRemove(() => {
        this.srcList = this.srcList.filter((imgInfo) => imgInfo.src !== item.src)
        imgItem.root().remove()
      })
      if (item.error) {
        imgItem.setError(true)
      }
      imgItem.onClickImage((src, name) => {
        this.imgPreviewModel.getHeader().append(name)
        this.imgPreviewModel.getBody().innerHTML = ''
        const img = document.createElement('img')
        img.src = src

        this.imgPreviewModel.getBody().append(img)
        this.imgPreviewModel.open()
      })

      newImgContainer.append(imgItem.root())
    })

    this._root.replaceChild(newImgContainer, this.imgListContainer)
    this.imgListContainer = newImgContainer

    return this
  }
}
