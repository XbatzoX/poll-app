import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CreateSurveyForm } from '../create-survey-form/create-survey-form';

@Component({
  selector: 'app-create-survey',
  imports: [CreateSurveyForm],
  templateUrl: './create-survey.html',
  styleUrl: './create-survey.scss',
})
export class CreateSurvey {
  router = inject(Router);
  formInputsValid = false;

  cancelDraft(){
    this.router.navigate(['']);
  }

  checkForm(valid:boolean){
    if(valid){
      this.formInputsValid = true;
    }else{
      this.formInputsValid = false;
    }
    console.log(this.formInputsValid);
  }
}
