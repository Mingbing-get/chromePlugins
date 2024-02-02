import Icon, { pathKeys } from '@components/icon'
import Grid from '@components/grid'

const iconDisplay = new Grid(5)

pathKeys.forEach((key) => {
  const box = document.createElement('div')
  box.setAttribute('style', 'display: flex; flex-direction: column; align-items: center; padding: 0.5rem 1rem')

  const text = document.createElement('span')
  text.append(key)

  const icon = new Icon(key)
  icon.root().style.fontSize = '25px'

  box.append(icon.root(), text)

  iconDisplay.root().append(box)
})

export default iconDisplay
