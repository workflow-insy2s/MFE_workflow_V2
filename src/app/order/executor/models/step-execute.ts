import { StepEx } from "./stepEx";
import { WorkflowExecution } from "./workflow-execute";

export class StepExecution {
    id: number;
    state: string;
    user_id: number;
    start_date: string;
    end_date: string;
    workflowExecution: any;
    step: StepEx;

    constructor(id: number, state: string, user_id: number, start_date: string, end_date: string, workflowExecution: any, step: StepEx) {
        this.id = id;
        this.state = state;
        this.user_id = user_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.workflowExecution = workflowExecution;
        this.step = step;
    }
}