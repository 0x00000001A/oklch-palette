export type WorkerTaskId = string | number | symbol

export type WorkerTaskData = {
  id: WorkerTaskId
}

export type WorkerTaskCallback = {
  (event: MessageEvent): void
}

export type WorkerTaskInQueue = {
  data: WorkerTaskData
  callback: WorkerTaskCallback
}

export type WorkerImplementation = {
  new (): Worker
}
