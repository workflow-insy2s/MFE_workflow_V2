import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowDto } from 'src/app/common/models/workflow-dto';


@Component({
  selector: 'app-modeling',
  templateUrl: './modeling.component.html',
  styleUrls: ['./modeling.component.css']
})
export class ModelingComponent implements OnInit{


  constructor(private route: ActivatedRoute ,private router:Router,private srv: ServiceService){}

  workflowId=this.route.snapshot.params['workflowId'];


  ngOnInit(): void {
    console.log(this.workflowId)
    this.getWorkflowDetail();

  }



  stepsCreate :any = [];
  workflow :WorkflowDto = {
    id:'',
    name: "",
    description: "",
    role:[],
    creationDate: '',
    steps: [],
    //workflowId: number;
  };
  numRole :number = 1;
  
  getWorkflowDetail(){
    this.srv.getWorkflowById(this.workflowId).subscribe((res: any) => {
      this.workflow = res;
    });
    this.srv.getAllStepsByWorkflowIdAndRoleId(this.workflowId ,this.numRole).subscribe((res:any) => {
      this.stepsCreate=res;

    });
}




















  simpleStep:Boolean=false;

  addSimpleStep(){
    this.simpleStep=true;


  }


}
