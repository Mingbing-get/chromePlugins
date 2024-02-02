import Modal from '@components/modal'
import Button from '@components/button'

import ShowImgList, { ImgInfo } from './showImgList'

const wrapperModal = new Modal()
const showImgList = new ShowImgList()

const queryAllImageButton = new Button('获取图片')
queryAllImageButton.root().addEventListener('click', () => {
  const imgs = document.body.getElementsByTagName('img')
  const srcList: ImgInfo[] = [...imgs]
    .filter((item) => !wrapperModal.root().contains(item))
    .map((item) => ({
      src: item.src,
      alt: item.alt,
    }))

  if (srcList.length > 0) {
    showImgList.setSrcList(
      srcList.reduce((total: ImgInfo[], item) => {
        if (!item.src.endsWith('.svg') && total.every((_item) => _item.src !== item.src)) {
          total.push(item)
        }

        return total
      }, [])
    )
    if (!wrapperModal.getBody().contains(showImgList.root())) {
      wrapperModal.getBody().append(showImgList.root())
    }
  } else {
    if (wrapperModal.getBody().contains(showImgList.root())) {
      wrapperModal.getBody().removeChild(showImgList.root())
    }
  }
})

wrapperModal.getBody().setAttribute('style', 'display: flex; flex-direction: column; align-items: center;')
wrapperModal.getBody().append(queryAllImageButton.root())
wrapperModal.setPosition('right-top').open()
