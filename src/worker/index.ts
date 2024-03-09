import {createWebWorkersManager} from '../lib/WebWorkersManager'
import ColorsWorker from './ColorsWorker.ts?worker'

export const colorsWorkerManager = createWebWorkersManager(ColorsWorker)
