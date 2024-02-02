import { Placement, VirtualElement, PopoverOffset } from '../popoverInstance'

export type ArrowSize = 'small' | 'large' | 'middle' | 'none'

export type PopoverHandleOptions = {
  target?: VirtualElement
  arrowSize?: ArrowSize
  placement?: Placement
  widthFollowTarget?: boolean
  offset?: PopoverOffset
}
