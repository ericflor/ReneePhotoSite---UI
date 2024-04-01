import { BatchAssign } from "./batchAssign";

export interface BatchAssignCreateRequest{
  batchAssign: BatchAssign,
  imeis: string[],
  outcomes: boolean[]
}
