import { StepEx } from "./stepEx";
import { WorkflowExecution } from "./workflow-execute";

export class InstanceStepEx {
    workflowEx: WorkflowExecution;
    steps: StepEx[];
  }