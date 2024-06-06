import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../service.service';
import { Workflow } from '../models/workflow';
import { WorkflowExecution } from '../models/workflow-execute';
import { StepEx } from '../models/stepEx';

@Component({
  selector: 'app-execution-details',
  templateUrl: './execution-details.component.html',
  styleUrls: ['./execution-details.component.css']
})
export class ExecutionDetailsComponent implements OnInit {

  
  constructor(private route: ActivatedRoute ,private router:Router,private srv: ServiceService){}
  workflowId=this.route.snapshot.params['workflowId'];
  

  workflow:Workflow;
  listWorkflowEx:WorkflowExecution[]=[];



  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.workflowId = params.get('workflowId');
      
    });

          //get information sur le workflow qui veux executer
          this.srv.getWorkflowById(this.workflowId).subscribe((res: any) => {
            this.workflow=res;
          });

          // getWorkflowExsByIdWorkflow pour le tableau de historique 
          this.srv.getWorkflowExsByIdWorkflow(this.workflowId).subscribe((res: any) => {
            this.listWorkflowEx=res;
            console.log("haw tableau:",this.listWorkflowEx)
          });


          this.newWorkflowExecution = {
            id:0,
            description: '',
            state: '',
            level: 0,
            user_id: 0,
            start_date: '',
            end_date: '',
            workflow: this.workflow
          };

          this.workflow={
            id:0,
            name: '',
            description: '',
            role_id: 1,
            creationDate: '',
            steps:[],
            stepCount: 0 
          }
  }

   /**************Si ona nouvelle execution***************** */
      newWorkflowExecution:WorkflowExecution ;
      listStep:StepEx[]=[];
      roleUser:number=1;
      IdUser:number=1;
      AddNewExecution(){
        this.listStep=[];
        //Creer un nouvelle WorkflowExecution
        this.newWorkflowExecution.workflow=this.workflow;
        
        this.newWorkflowExecution.state="Ouvert";
        this.newWorkflowExecution.user_id=this.IdUser;
        this.srv.AddWorkflowEx(this.newWorkflowExecution).subscribe((res: any) => {
          this.newWorkflowExecution=res;
          console.log("AddWorkflowEx +",this.newWorkflowExecution)

                  //recuperation de tous les Steps avec workflowId
                  let listStep2:StepEx[]=[];
                  this.srv.getAllStepsByWorkflowIdAndRoleId(this.workflowId,this.roleUser).subscribe((res: any) => {
                    listStep2=res;
                    console.log("getAllStepsByWorkflowIdAndRoleId :",this.listStep)

      
                              this.srv.AddStepsInStepsExwithIdWorkflowEx(this.newWorkflowExecution.id,this.IdUser,listStep2).subscribe((res: any) => {
                                this.listWorkflowEx=res;
                                console.log(" tous il marche bien");
                                this.router.navigate(['/mfe1/orderComponent/executor/workflowExecute/',this.newWorkflowExecution.id]);
                              },
                              (err) => {
                                console.log("tous il marche bien");
                                this.router.navigate(['/mfe1/orderComponent/executor/workflowExecute/',this.newWorkflowExecution.id]);
                              });
                            



                  });


        });

        


      }




   /*^^^^^^^^^^^^^^^^^^^^^^^^^^*fin nouvelle execution***************** */

     /**************pour continue l'execution d'un workflow***************** */
     continue(idWorkflowEx:any){
      this.router.navigate(['/mfe1/orderComponent/executor/workflowExecute/',idWorkflowEx]);

     }
    /*************fin pour continue l'execution d'un workflow***************** */
    pageIndex = 1;
    pageSize = 6;
    onPageChange(event: any): void {
      this.pageIndex = event.pageIndex + 1;
    }
}
