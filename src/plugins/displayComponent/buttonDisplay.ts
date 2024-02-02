import Button, { ButtonType } from '@components/button'
import Row from '@components/row'
import Column from '@components/column'

const displayButton = new Button('确定')

const toggleBlock = new Button('块状')
toggleBlock.root().addEventListener('click', () => {
  displayButton.setBlock(!displayButton._block)
})

const toggleDisabled = new Button('禁止')
toggleDisabled.root().addEventListener('click', () => {
  displayButton.setDisabled(!displayButton._disabled)
})

const toggleLoading = new Button('加载中')
toggleLoading.root().addEventListener('click', () => {
  displayButton.setLoading(!displayButton._loading)
})

const toggleGhost = new Button('透明')
toggleGhost.root().addEventListener('click', () => {
  displayButton.setGhost(!displayButton._ghost)
})

const toggleType = new Button('切换type')
toggleType.root().addEventListener('click', () => {
  const types: ButtonType[] = ['default', 'danger', 'primary', 'success', 'warning']
  const index = types.findIndex((item) => item === displayButton._type)
  displayButton.setType(types[(index + 1) % types.length])
})

const actions = new Row(toggleBlock.root(), toggleDisabled.root(), toggleLoading.root(), toggleGhost.root(), toggleType.root())
actions.root().style.marginTop = '1rem'
actions.root().style.borderTop = '1px solid #ccc'
actions.root().style.paddingTop = '1rem'

const buttonDisplay = new Column(displayButton.root(), actions.root())
buttonDisplay.root().style.alignItems = 'center'

export default buttonDisplay
