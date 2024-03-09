import {
  WorkerImplementation,
  WorkerTaskCallback,
  WorkerTaskData,
  WorkerTaskId,
  WorkerTaskInQueue
} from './types.ts'

export const createWebWorkersManager = (WorkerToUse: WorkerImplementation) => {
  const availableWorkers: Worker[] = new Array(navigator.hardwareConcurrency)
    .fill(undefined)
    .map(() => {
      return new WorkerToUse()
    })

  const queue = new Map<WorkerTaskId, WorkerTaskInQueue>([])

  const runTask = <GData extends WorkerTaskData, GCallback extends WorkerTaskCallback>(
    data: GData,
    callback: GCallback
  ) => {
    const hasFreeWorkers = availableWorkers.length
    let nextTaskId: WorkerTaskId = data.id
    let nextTaskPayload: WorkerTaskInQueue = {data, callback}

    if (!hasFreeWorkers) {
      queue.set(nextTaskId, nextTaskPayload)
      return
    }

    const freeWorker = availableWorkers.pop()!
    freeWorker.postMessage(data)

    freeWorker.onmessage = (e) => {
      availableWorkers.push(freeWorker)
      callback(e)

      const queueIterator = queue.entries().next()

      if (queueIterator.done) {
        return
      }

      nextTaskId = queueIterator.value[0]
      nextTaskPayload = queueIterator.value[1]

      queue.delete(nextTaskId)
      runTask(nextTaskPayload.data, nextTaskPayload.callback)
    }
  }

  return {
    runTask
  }
}
