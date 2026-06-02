import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Surveys } from '../../services/surveys';
import { SurveyModel } from '../../models/surveymodel';

@Component({
  selector: 'app-survey-view',
  imports: [RouterLink],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView {
  private route = inject(ActivatedRoute);
  dbServive = inject(Surveys);
  actualSurvey!:SurveyModel;

  ngOnInit(){
    let currentName = this.route.snapshot.paramMap.get('name');
    this.actualSurvey = this.dbServive.sortedSurveys().find(survey => survey.name === currentName) ?? this.dbServive.sortedSurveys()[0];
    console.log(this.actualSurvey);
  }

  createShortDate(){
    let stringDate = `${this.actualSurvey.end_date.getDate()}.${this.actualSurvey.end_date.getMonth()}.${this.actualSurvey.end_date.getFullYear()}`;
    return stringDate;
  }
}
