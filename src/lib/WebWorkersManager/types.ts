export type WorkerTaskId = number | string | symbol

export type WorkerTaskData = {
  channel: number
  id: WorkerTaskId
}

export type WorkerTaskCallback = {
  (event: MessageEvent): void
}

export type WorkerImplementation = {
  new (): Worker
}
