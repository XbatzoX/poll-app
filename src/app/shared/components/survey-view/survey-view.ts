import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Surveys } from '../../services/surveys';
import { SurveyModel } from '../../models/surveymodel';
import { PermissionMultiple, dummyPermissionObj } from '../../interfaces/permission-multiple';
import { LoadedQuestions } from '../../interfaces/new-survey';

@Component({
  selector: 'app-survey-view',
  imports: [RouterLink],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView {
  private route = inject(ActivatedRoute);
  dbServive = inject(Surveys);
  actualSurvey = new SurveyModel();
  amountQuestions:number = 0;
  permissionCheckbox:PermissionMultiple[] = [];
  valueChanged:boolean = false;
  isAnyResultAvailable:boolean = false;
  isSurveyValid:boolean = false;

  ngOnInit(){
    let currentName = this.route.snapshot.paramMap.get('name');
    this.actualSurvey = this.dbServive.sortedSurveys().find(survey => survey.name === currentName) ?? this.dbServive.sortedSurveys()[0];
    if(this.actualSurvey && this.actualSurvey.questions){
      this.actualSurvey.questions = [...this.actualSurvey.questions].sort((a, b) => a.question_number - b.question_number);
    }
    this.amountQuestions = this.actualSurvey.questions.length;
    this.createArrayOfMultipleAnswers();
    console.log(this.actualSurvey);
    console.log(this.permissionCheckbox);
    this.isAnyResultAvailable = this.getResult();
  }

  createShortDate(){
    let stringDate = `${this.actualSurvey.end_date.getDate()}.${this.actualSurvey.end_date.getMonth()}.${this.actualSurvey.end_date.getFullYear()}`;
    return stringDate;
  }

  createArrayOfMultipleAnswers(){
    for (let index = 0; index < this.amountQuestions; index++) {
      let permissionObj = {...dummyPermissionObj};
      this.permissionCheckbox.push(permissionObj);
    }
  }

  toggleAnswer(index:number, answerNumber:number){
    this.valueChanged = false;
    if(this.actualSurvey.questions[index].is_multiple){this.permissionCheckbox[index].permissionMultiple = true;}
    this.toggleIfAnswerAlreadyChecked(index, answerNumber);
    this.permissionCheckbox[index].anyAnswerChecked = this.isAnyAnswerAlreadyChecked(index);
    if(!this.permissionCheckbox[index].permissionMultiple && this.permissionCheckbox[index].anyAnswerChecked) return;
    if(!this.valueChanged){this.checkChoosenAnswer(index, answerNumber);}
    console.log(this.actualSurvey);
    this.isSurveyValid = this.checkUserResults();
  }

  isAnyAnswerAlreadyChecked(index:number){
    let checked = false;
    for (let i = 1; i < 7; i++) {
      if(this.permissionCheckbox[index][`checkedAnswer${i}` as keyof PermissionMultiple]){
        checked = true;
        break;
      }
    }
    return checked;
  }

  toggleIfAnswerAlreadyChecked(index:number, answerNumber:number){
    this.valueChanged = false;
    if(this.permissionCheckbox[index][`checkedAnswer${answerNumber}` as keyof PermissionMultiple]){
      this.permissionCheckbox[index][`checkedAnswer${answerNumber}` as keyof PermissionMultiple] = false;
      if((this.actualSurvey.questions[index][`counter${answerNumber}` as keyof LoadedQuestions] as number) > 0){
        this.actualSurvey.questions[index][`counter${answerNumber}` as keyof LoadedQuestions]--;
      }
      this.valueChanged = true;
    }
  }

  checkChoosenAnswer(index:number, answerNumber:number){
    for (let i = 1; i < 7; i++) {
      if(i == answerNumber){
        this.permissionCheckbox[index][`checkedAnswer${i}` as keyof PermissionMultiple] = true;
        this.permissionCheckbox[index].anyAnswerChecked = true;
        this.actualSurvey.questions[index][`counter${i}` as keyof LoadedQuestions]++;
        break;
      }
    }
  }

  getResult(){
    let resultExist = false;
    for (let index = 1; index < 7; index++) {
      if((this.actualSurvey.questions[0][`counter${index}` as keyof LoadedQuestions] as number) > 0){
        resultExist = true;
        break;
      }
    }
    return resultExist;
  }

  checkUserResults():boolean{
    let valid = false;
    for (let index = 0; index < this.amountQuestions; index++) {
      if(!this.permissionCheckbox[index].anyAnswerChecked){
        break;
      }
      if(index == (this.amountQuestions - 1)){valid = true;}
    }
    return valid;
  }
}
