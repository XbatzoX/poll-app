import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Surveys } from '../../services/surveys';
import { SurveyModel } from '../../models/surveymodel';
import { PermissionMultiple, dummyPermissionObj } from '../../interfaces/permission-multiple';
import { LoadedQuestions } from '../../interfaces/new-survey';
import { dummyResultObj, ResultValues, SurveyCounter } from '../../interfaces/survey-counter';
import { SurveyCompletedDialog } from '../survey-completed-dialog/survey-completed-dialog';

@Component({
  selector: 'app-survey-view',
  imports: [RouterLink, SurveyCompletedDialog],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  dbServive = inject(Surveys);
  actualSurvey = new SurveyModel();
  amountQuestions:number = 0;
  permissionCheckbox:PermissionMultiple[] = [];
  valueChanged:boolean = false;
  isAnyResultAvailable:boolean = false;
  isSurveyValid:boolean = false;
  resultValues = signal<SurveyCounter[]>([]);
  resultsInPercent = signal<ResultValues[]>([]);
  formattedEndDate = signal<string>('');
  showDialog = signal<boolean>(false);
  isSurveyEditable = signal<boolean>(true);
  arrCompletedSurveys:string[] = [];
  isHovered = signal<boolean>(false);
  resultsShown = signal<boolean>(true);
  showResultBtnValue:string = '';

  constructor(){
    this.chooseResultBtnValue();
  }

  /** This function is used to load the choosen or last choosen survey from database or local storage */
  ngOnInit(){
    this.dbServive.getAllSurveys().then(() => {
      this.checkLocalStorage();
      if(this.actualSurvey && this.actualSurvey.questions){this.actualSurvey.questions = [...this.actualSurvey.questions].sort((a, b) => a.question_number - b.question_number);}
      this.amountQuestions = this.actualSurvey.questions.length;
      this.createArrayOfMultipleAnswers();
      this.isAnyResultAvailable = this.getResult();
      if(this.isAnyResultAvailable){this.prepareDataForProgressIndication(); console.log(this.resultValues());}
      });
  }

  /** This function read and write choosen survey from and to local storage */
  checkLocalStorage(){
    this.actualSurvey = this.dbServive.surveyList().find(survey => survey.id === Number(this.route.snapshot.paramMap.get('id'))) ?? this.dbServive.sortedSurveys()[0];
    if(this.actualSurvey == undefined){
      this.actualSurvey = this.getDataFromLocalStorage();
      this.actualSurvey.end_date = new Date(this.actualSurvey.end_date);
    }else{
      this.saveToLocalStorage();
    }
    this.createShortDate();
    this.arrCompletedSurveys = this.checkIfSurveyCompleted();
  }

  /** This function writes the actual choosen survey to local storage */
  saveToLocalStorage(){
    localStorage.setItem('mySurvey', JSON.stringify(this.actualSurvey));
  }

  /** This function is used to save the information to local storage that the actual survey is completed */
  saveSurveyCompletedToLocalStorage(){
    this.arrCompletedSurveys.push(String(this.actualSurvey.id));
    localStorage.setItem('completedSurveys', JSON.stringify(this.arrCompletedSurveys));
  }

  /** This function loads the last choosen survey from local storage */
  getDataFromLocalStorage(){
    let outputObj = JSON.parse(localStorage.getItem('mySurvey') || '{}');
    return outputObj;
  }

  /** Tis function loads the completed surveys list from local storage */
  getCompletedSurveysFromLocalStorage(){
    let outputObj = JSON.parse(localStorage.getItem('completedSurveys') || '[]');
    return outputObj;
  }

  /** This function checks if survey already completed */
  checkIfSurveyCompleted(){
    let storageArr = this.getCompletedSurveysFromLocalStorage();
    for (let index = 0; index < storageArr.length; index++) {
      if((Number(storageArr[index]) == this.actualSurvey.id) || (this.actualSurvey.remainingDays == 'Survey expired')){
        this.isSurveyEditable.set(false);
        break;
      }
    }
    return storageArr;
  }

  /** This function is used to format the date type into string */
  createShortDate(){
    let stringDate = `${this.actualSurvey.end_date.getDate()}.${this.actualSurvey.end_date.getMonth() + 1}.${this.actualSurvey.end_date.getFullYear()}`;
    this.formattedEndDate.set(stringDate);
  }

  /** This function creates an array filled with permission object */
  createArrayOfMultipleAnswers(){
    for (let index = 0; index < this.amountQuestions; index++) {
      let permissionObj = {...dummyPermissionObj};
      this.permissionCheckbox.push(permissionObj);
    }
  }

  /**
   * 
   * @param index - includes the question number
   * @param answerNumber - includes the answer number of question
   * @returns 
   */
  toggleAnswer(index:number, answerNumber:number){
    this.valueChanged = false;
    if(this.actualSurvey.questions[index].is_multiple){this.permissionCheckbox[index].permissionMultiple = true;}
    this.toggleIfAnswerAlreadyChecked(index, answerNumber);
    this.permissionCheckbox[index].anyAnswerChecked = this.isAnyAnswerAlreadyChecked(index);
    if(!this.permissionCheckbox[index].permissionMultiple && this.permissionCheckbox[index].anyAnswerChecked) return;
    if(!this.valueChanged){this.checkChoosenAnswer(index, answerNumber);}
    this.isSurveyValid = this.checkUserResults();
    this.prepareDataForProgressIndication();
  }

  /**
   * This function checks if any answer of question is already checked
   * @param index - includes the array index number of permission checkbox
   * @returns - a boolean feedback
   */
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

  /**
   * This function is used to toggle the answer checkbox
   * @param index - includes the array index number of permission checkbox
   * @param answerNumber - includes the answer number
   */
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

  /**
   * This function check the unchecked checkbox and increases the counter of answer
   * @param index - includes the array index number of permission checkbox
   * @param answerNumber - includes the answer number
   */
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

  /** This function is used to check if any result of survey exist */
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

  /** This function is used to check if any answer of every question is checked */
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

  /** This function updates the counter values of surveys in supabase and put the survey completed info to local storage */
  updateSurvey(){
    if(this.isSurveyValid){
      for (let index = 0; index < this.amountQuestions; index++) {
        let counterData = this.prepareDataForQuestion(index);
        this.dbServive.updateQuestionsTable(counterData, this.actualSurvey.name, this.actualSurvey.id, (index + 1));
        this.showDialog.set(true);
      }
      this.saveSurveyCompletedToLocalStorage();
    }else{
      this.router.navigate(['']);
    }
  }

  /**
   * This function prepares the counter values of actual surveys into object
   * @param index - includes the question number
   * @returns - an object filled with counter data
   */
  prepareDataForQuestion(index:number){
    let counterData:SurveyCounter = {
      "counter1": this.actualSurvey.questions[index].counter1,
      "counter2": this.actualSurvey.questions[index].counter2,
      "counter3": this.actualSurvey.questions[index].counter3,
      "counter4": this.actualSurvey.questions[index].counter4,
      "counter5": this.actualSurvey.questions[index].counter5,
      "counter6": this.actualSurvey.questions[index].counter6
    }
    return counterData;
  }

  /** This function prepares the counter values for the progress bar in result indication */
  prepareDataForProgressIndication(){
    this.fillSignalWithData();
    this.calculateResultValues();
  }

  /** This function is used to update the signal data for current result indication */
  fillSignalWithData(){
    this.resultValues.set([]);
     for (let index = 0; index < this.amountQuestions; index++) {
      let counterData:SurveyCounter = this.prepareDataForQuestion(index);
      this.resultValues.update(currentList => [...currentList, counterData]);
    }
  }

  /** This function calculates the counter result data for result indication in percent*/
  calculateResultValues(){
    this.resultsInPercent.set([]);
    for (let index = 0; index < this.amountQuestions; index++) {
      let counterData:SurveyCounter = this.resultValues()[index];
      let resultData:ResultValues = {...dummyResultObj};
      for (let i = 1; i < 7; i++) {
        let counterKey = `counter${i}` as keyof SurveyCounter;
        resultData.resultTotal = resultData.resultTotal + counterData[counterKey];
      }
      for (let j = 1; j <= 6; j++) {
        (resultData)[`resultInPercent${j}` as keyof ResultValues] = Math.round((counterData[`counter${j}` as keyof SurveyCounter] / resultData.resultTotal) * 100);
      }
      this.resultsInPercent.update(currentList => [...currentList, resultData]);
    }
  }

  /** This function is used to return the correct image path of arrow from show result button in mobile view */
  selectPath():string{
    let path = '';
    if(this.isHovered() && this.resultsShown()){
      path = 'assets/icons/arrow_up_orange_height.svg';
    }else if(!this.isHovered() && this.resultsShown()){
      path = 'assets/icons/arrow_up_purple.svg';
    }else if(this.isHovered() && !this.resultsShown()){
      path = 'assets/icons/arrow_drop_down_orange_height.svg';
    }else {
      path = 'assets/icons/arrow_drop_down_purple.svg';
    }
    return path;
  }

  /** This function is used to customize the correct indication text on show result button */
  chooseResultBtnValue(){
    if(this.resultsShown()){
      this.showResultBtnValue = 'Close results';
    }else{
      this.showResultBtnValue = 'See results';
    }
  }

  /** This function toggles the state of signal results are shown */
  toggleShownResultsMobile(){
    if(this.resultsShown()){
      this.resultsShown.set(false);
    }else{
      this.resultsShown.set(true);
    }
    this.chooseResultBtnValue();
  }
}
