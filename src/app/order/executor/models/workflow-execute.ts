import { Workflow } from "./workflow";

export class WorkflowExecution {
    id: number;
    description: string;
    state: string;
    level:number;
    user_id: number;
    start_date: string;
    end_date: string;
    workflow: Workflow;
   

    constructor(id: number,description: string, state: string,level:number, user_id: number, start_date: string, end_date: string, workflow: Workflow) {
        this.id = id;
        this.description=description;
        this.state = state;
        this.level= level;
        this.user_id = user_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.workflow = workflow;
    }
}