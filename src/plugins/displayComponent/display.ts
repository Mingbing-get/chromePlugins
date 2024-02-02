import Modal from '@components/modal'
import Row from '@components/row'
import Button from '@components/button'
import Base from '@components/base'

import buttonDisplay from './buttonDisplay'
import iconDisplay from './iconDisplay'
import popoverDisplay from './popoverDisplay'

interface Config {
  text: string
  display: Base<any>
}

const config: Config[] = [
  {
    text: '按钮',
    display: buttonDisplay,
  },
  {
    text: '图标',
    display: iconDisplay,
  },
  {
    text: 'popover',
    display: popoverDisplay,
  },
]

const displayModal = new Modal()
displayModal.showClose()
displayModal.getHeader().style.fontWeight = '600'
const displayRow = new Row()
for (const item of config) {
  const button = new Button(item.text).root()
  button.addEventListener('click', () => {
    displayModal.getHeader().innerHTML = ''
    displayModal.getHeader().append(item.text)
    displayModal.getBody().innerHTML = ''
    displayModal.getBody().append(item.display.root())
    displayModal.open()
  })
  displayRow.root().append(button)
}

export default displayRow
