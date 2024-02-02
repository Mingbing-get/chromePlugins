import Popover from '@components/popover'
import Column from '@components/column'
import Button from '@components/button'
import { Placement } from '@components/popoverInstance'

const popoverDisplay = new Column()

interface Config {
  tipText: string
  popoverText: string
}
const config: Config[] = [
  {
    tipText: 'trigger',
    popoverText: 'popover text',
  },
]

config.forEach((item) => {
  const target = document.createElement('span')
  target.setAttribute('style', 'word-break: keep-all; white-space: nowrap; display: inline-block;')
  target.append(item.tipText)
  const popover = new Popover(target, item.popoverText)

  const togglePlacement = new Button('切换placement')
  const placement: Placement[] = [
    'bottom',
    'bottom-end',
    'bottom-start',
    'left',
    'left-end',
    'left-start',
    'right',
    'right-end',
    'right-start',
    'top',
    'top-end',
    'top-start',
  ]
  let index = 0
  togglePlacement.root().addEventListener('click', () => {
    index++

    popover.setPlacement(placement[index % placement.length])
  })

  popoverDisplay.root().append(target, togglePlacement.root())
})

export default popoverDisplay
