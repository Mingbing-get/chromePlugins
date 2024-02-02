import { PopoverHandleOptions } from '../popoverHandle/type'

export interface PopoverOptions extends Omit<PopoverHandleOptions, 'target'> {
  trigger?: 'click' | 'hover' | 'focus'
  visible?: boolean
  preventControlVisible?: boolean
  delay?: number
  hoverOpenDelay?: number
}
