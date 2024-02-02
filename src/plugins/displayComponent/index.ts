import Modal from '@components/modal'
import displayRow from './display'

const wrapperModal = new Modal()
wrapperModal.getBody().append(displayRow.root())
wrapperModal.setPosition('right-top').open()
