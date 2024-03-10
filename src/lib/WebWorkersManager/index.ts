import {LCH_CHANNELS_NAMES} from '../../state'

import {
  WorkerImplementation,
  WorkerTaskCallback,
  WorkerTaskData,
  WorkerTaskId
} from './types.ts'

export const createWebWorkersManager = (WorkerToUse: WorkerImplementation) => {
  const availableWorkers: Worker[] = new Array(navigator.hardwareConcurrency)
    .fill(undefined)
    .map(() => {
      return new WorkerToUse()
    })

  const queue = new Map<WorkerTaskId, WorkerTaskData>([])
  const subscribers = new Map<LCH_CHANNELS_NAMES, WorkerTaskCallback[]>()

  const subscribe = (channel: LCH_CHANNELS_NAMES, callback: WorkerTaskCallback) => {
    const existingSubscribers = subscribers.get(channel) || []

    subscribers.set(channel, [...existingSubscribers, callback])
  }

  const unsubscribe = (channel: LCH_CHANNELS_NAMES, callback: WorkerTaskCallback) => {
    const existingSubscribers = subscribers.get(channel) || []

    subscribers.set(
      channel,
      existingSubscribers.filter((subscribersItem) => {
        return subscribersItem !== callback
      })
    )
  }

  const notifySubscribers = (
    event: MessageEvent<WorkerTaskData>,
    subscribersToNotify: WorkerTaskCallback[] = []
  ) => {
    subscribersToNotify.forEach((subscriber) => {
      subscriber(event)
    })
  }

  const runTask = <GData extends WorkerTaskData>(data: GData) => {
    const freeWorker = availableWorkers.pop()
    let nextTaskId: WorkerTaskId = data.id
    let nextTaskPayload = data

    if (!freeWorker) {
      queue.set(nextTaskId, nextTaskPayload)
      return
    }

    freeWorker.postMessage(data)

    freeWorker.onmessage = (event: MessageEvent<WorkerTaskData>) => {
      availableWorkers.push(freeWorker)

      notifySubscribers(event, subscribers.get(data.channel))

      const queueIterator = queue.entries().next()

      if (queueIterator.done) {
        return
      }

      nextTaskId = queueIterator.value[0]
      nextTaskPayload = queueIterator.value[1] as never

      queue.delete(nextTaskId)
      runTask(nextTaskPayload)
    }
  }

  return {
    runTask,
    subscribe,
    unsubscribe
  }
}
