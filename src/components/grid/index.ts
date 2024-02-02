import Base from '@components/base'

import './index.scss'

export default class Grid extends Base<HTMLDivElement> {
  private _column: number

  constructor(column: number) {
    super(document.createElement('div'))

    this._root.setAttribute('class', 'prowler-grid')
    this._column = column
    this.setColumn(column)
  }

  setColumn(column: number) {
    this._column = column

    this._root.style.gridTemplateColumns = `repeat(${column}, ${(1 / column) * 100}%)`
  }
}
