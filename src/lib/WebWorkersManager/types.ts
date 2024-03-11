export type WorkerTaskId = number | string | symbol

export type WorkerChannel = number | string | symbol

export type WorkerTaskData = {
  channel: WorkerChannel
  id: WorkerTaskId
}

export type WorkerTaskCallback = {
  (event: MessageEvent): void
}

export type WorkerImplementation = {
  new (): Worker
}
