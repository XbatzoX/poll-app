import { Component, inject } from '@angular/core';
import { Surveys } from '../../services/surveys';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-surveys',
  imports: [],
  templateUrl: './main-surveys.html',
  styleUrl: './main-surveys.scss',
})
export class MainSurveys {
  dbService = inject(Surveys);
  router = inject(Router);

  /** This function is used to load all surveys from supabase after load of all elements */
  ngOnInit(){
    this.dbService.getAllSurveys();
  }

  /**
   * This function is used to open the choosen survey
   * @param index - includes index number of sorted surveys array
   */
  openSurvey(index:number){
    let surveyId = this.dbService.sortedSurveys()[index].id;
    this.router.navigate(['/survey', surveyId]);
  }
}
