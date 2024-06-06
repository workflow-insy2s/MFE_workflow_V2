import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../service.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { StepEx } from '../models/stepEx';
import { StepExecution} from '../models/step-execute';
import { Rule } from '../models/rule';
import { Objet, RuleObjet } from '../models/ruleObjet';
import { WorkflowExecution } from '../models/workflow-execute';

@Component({
  selector: 'app-workflow-execute',
  templateUrl: './workflow-execute.component.html',
  styleUrls: ['./workflow-execute.component.css']
})
export class WorkflowExecuteComponent implements OnInit{
  AllStepsExOfWorkflowEx2:StepExecution[] = [];  
  stepsFinished:StepEx[] = []; // liste de Steps qui deja executer 
  StepRuning:StepExecution;// SExecute Step qui encours d'execution
  listRule: Rule[]=[]
  stepOfStepEx!:StepEx; // step2 step2 qui pointer sur le step de workflow
  nombreRule :number = 0;
  nombreRuleExecute :number = 0;
  workflow: { id: number; name: string; description: string; role_id: number; creationDate: string; steps: never[]; stepCount: number; };


  constructor(private route: ActivatedRoute ,private router:Router,private srv: ServiceService){}
  workflowExId=this.route.snapshot.params['workflowExId'];
  



  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.workflowExId = params.get('workflowExId');
      this.getlistStepsEx(this.workflowExId);
  
      
    });



    this.WorkflowExecutionTr = {
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

  getlistStepsEx(workflowExId:any){
    let AllStepsExOfWorkflowEx:StepExecution[] = []; 
    this.executeButton=false;
    this.progresserButton=false;
    this.srv.getAllStepExByIdWorkflowEx(workflowExId).subscribe((res: any) => {
      this.stepsFinished = [];
      AllStepsExOfWorkflowEx = res;
      this.AllStepsExOfWorkflowEx2=res;
      let test = true;
      let i = 0;
      

      while (test && i < AllStepsExOfWorkflowEx.length) {
        
              if (AllStepsExOfWorkflowEx[i].state === "terminer") {
                this.stepsFinished.push(AllStepsExOfWorkflowEx[i].step);
                i++;
                console.log(this.stepsFinished)
              } else if(AllStepsExOfWorkflowEx[i].state === "Ouvert"){
                this.StepRuning = AllStepsExOfWorkflowEx[i];
                console.log("hathy StepRuning",this.StepRuning)
                this.stepOfStepEx = AllStepsExOfWorkflowEx[i].step;
                test = false;
                if(this.stepOfStepEx){
                  console.log(this.stepOfStepEx.entryRulesId.length)
                  if(0 < this.stepOfStepEx.entryRulesId.length)
                  this.getAllObjectSaisirOfRules(this.stepOfStepEx.entryRulesId)
          
                }else{
                  alert("Workflow déja executer");
                  console.log("Workflow déja executer")
                }
                
      
              }

      
        

      }
  



    }, (error) => {
      console.error('Error serveur', error);
      alert('Une erreur est survenue lors de la récupération des résultats.');
    });

  }
  /********************************************Pour le 2eme version de execution ***************************************************************** */
  ListObjectSaisir: Objet[]=[]  
  getAllObjectSaisirOfRules(RulesId:any[]){
    console.log("le tableau de methode qui retourne le object de type Saisir",RulesId)
      for (let i = 0; i < RulesId.length; i++) {
        //getAllObjectOfRule if type object == saisir add this object in ListObjectSaisir
        let localRuleObjectList:RuleObjet[]=[];
        this.srv.getAllObjetByRuleId(RulesId[i]).subscribe((res: any) => {
           localRuleObjectList = res;
           console.log("la list de objet a executer de regle:",localRuleObjectList)
           //
                 //parcourire les RuleObjet et récupére les objets des cette regle 
                 if (localRuleObjectList) {   
                   for (let i = 0; i < localRuleObjectList.length; i++) {
                     if(localRuleObjectList[i].objet.type === "saisir"){
                       this.ListObjectSaisir.push(localRuleObjectList[i].objet);
                     }
                     
                   }
                 }
     
          
         }, (error) => {
           console.error('Error serveur', error);
           alert('Une erreur est survenue lors de la récupération les objets de regle.');
         });


      }


      
    }





    Sauv(objs:Objet[]=[]) {
      let i=0
      for(i;i<objs.length;i++){


        
            // Sauvegarde des inputs dans l'objet
            console.log("l'objet=",objs[i])
            this.srv.editObjet(objs[i], objs[i].id).subscribe(
              (result) => {
                console.log(result);




                // Après la sauvegarde, continuer le traitement des objets restants
                Swal.fire('Valider', '', 'success');
                  
            
              },
              (err) => {
                // Traitement du cas d'erreur
                console.log(err);
                Swal.fire('Invalid ', '', 'error');
              }
            ); 

      }

      if(i== objs.length){
        this.executeRules();
      }


 
    }
    executeButton:boolean=false;
    progresserButton:boolean=false;
    showExecuteButton(){
      if(this.ListObjectSaisir.length == 0){
        this.executeButton = true;
      }

    }

    //pour executer les regles
    async executeRules(){
      let testRuslt:boolean=true;
      let i = 0;
      while(testRuslt && i < this.stepOfStepEx.entryRulesId.length){
        try {
          const res = await this.srv.getResultRule(this.stepOfStepEx.entryRulesId[i]).toPromise();
          
          if (res === true){
            i++;

          //this.nombreRuleExecute =this.nombreRuleExecute + 1 ;
          console.log("les resultat de cette regle :",res)
      
          }else {
            let testRuslt=false;
            Swal.fire('Invalid ', '', 'error');
            
          }
        } catch (error) {
          testRuslt=false;
          console.error('Erreur lors de la récupération du résultat pour la règle ID:', error);
          alert('Une erreur est survenue lors de la récupération des résultats pour les règles.');
      
        }

      }
      if(testRuslt){
        this.progresserButton=true;
      }
  
        
      
    
      }

            // methode pour passer a l'etape suivant
            progresser(){

                this.StepRuning.state= "terminer"
                this.srv.editStepEx(this.StepRuning,this.StepRuning.id).subscribe(
                  (result) => { 
                  console.log("le step est terminer en passer a la suivant")
                  window.location.reload();
                 //this.getlistSteps(this.workflowId);
            
                },
                (err) => {
                  // traitement du cas d'erreur
                  console.log(err)
                  
                }
                )
                
            }
            
            
            
            
            
            



      
  /********************************************Fin Pour le 2eme version de execution ***************************************************************** */
  estDernierObjet(liste:StepExecution[], objetRecherche: StepExecution): boolean {
    const dernierObjet = liste[liste.length - 1];
    return dernierObjet === objetRecherche;
}

            // methode pour passer a l'etape suivant
            WorkflowExecutionTr:WorkflowExecution ;
            
            progresser1(){
              const estDernier = this.estDernierObjet(this.AllStepsExOfWorkflowEx2, this.StepRuning);
              console.log("test la fin de workflow ou non :",estDernier)

              if (estDernier) {
                this.StepRuning.state= "terminer"
              this.srv.editStepEx(this.StepRuning,this.StepRuning.id).subscribe(
                (result) => { 
                console.log("le workflow terminer ")
                              // Sauvgarder le workflow terminer
                              this.WorkflowExecutionTr.state="terminer"
                              console.log("le workflowEx qui il faut change:",this.WorkflowExecutionTr)
                              console.log("le workflowEx Id:",this.workflowExId)

                              this.srv.editWorkflowEx(this.WorkflowExecutionTr,this.workflowExId).subscribe(
                                (result) => { 
                                console.log("le workflow terminer ")
                                Swal.fire('L\'exécution du workflow s\'est terminée avec succés', '', 'success');
                                
                              
                          
                              },
                              (err) => {
                                // traitement du cas d'erreur
                                console.log(err)
                                
                              })
                
               
          
              },
              (err) => {
                // traitement du cas d'erreur
                console.log(err)
                
              }
              )

              }else {
                this.StepRuning.state= "terminer"
              this.srv.editStepEx(this.StepRuning,this.StepRuning.id).subscribe(
                (result) => { 
                console.log("le step est terminer en passer a la suivant")
                window.location.reload();
               //this.getlistSteps(this.workflowId);
          
              },
              (err) => {
                // traitement du cas d'erreur
                console.log(err)
                
              }
              )
              }

              
              
          }
}
