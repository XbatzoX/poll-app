import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CreateSurveyForm } from '../create-survey-form/create-survey-form';
import { CreateSurveyDialog } from '../create-survey-dialog/create-survey-dialog';

@Component({
  selector: 'app-create-survey',
  imports: [CreateSurveyForm, CreateSurveyDialog],
  templateUrl: './create-survey.html',
  styleUrl: './create-survey.scss',
})
export class CreateSurvey {
  router = inject(Router);
  formInputsValid = false;
  showDialog = signal<boolean>(false);

  /*** This function is used to navigate to main page*/
  cancelDraft(){
    this.router.navigate(['']);
  }

  /** This function checks if the input values of form are valid */
  checkForm(valid:boolean){
    if(valid){
      this.formInputsValid = true;
    }else{
      this.formInputsValid = false;
    }
  }
}
