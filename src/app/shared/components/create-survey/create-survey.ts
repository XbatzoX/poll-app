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

  cancelDraft(){
    this.router.navigate(['']);
  }
}
