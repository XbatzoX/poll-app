import { Component, ElementRef, HostListener, output, signal, viewChild, OnInit, OnDestroy, inject, model } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { dummyQuestionObj, NewSurvey, QuestionAnswers } from '../../interfaces/new-survey';
import { AnswerModel } from '../../models/answermodel';
import { Subscription } from 'rxjs';
import { Surveys } from '../../services/surveys';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-survey-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-survey-form.html',
  styleUrl: './create-survey-form.scss',
})
export class CreateSurveyForm {
  isHoveredId: string;
  isHoveredArrow: boolean;
  categoryList = ['Team Activities', 'Health & Wellness', 'Gaming & Entertainment',
    'Education & Learning', 'Lifestyle & Preferences', 'Technology & Innovation'
  ];
  amountQuestions:number;
  question_1:AnswerModel = new AnswerModel();
  questions:AnswerModel[] = [this.question_1];
  actualQuestion:QuestionAnswers = {
    "question": '',
    "isMultiple": false,
    "answers": []
  }
   actualSurvey:NewSurvey = {
    "name":'',
    "endDate": new Date(),
    "category":'',
    "description":'',
    "questions": [this.actualQuestion]
  };
  choosenDate:string;
  dbService = inject(Surveys);
  router = inject(Router);
  
  constructor(){
    this.isHoveredId = '';
    this.isHoveredArrow = false;
    this.amountQuestions = 1;
    this.addNewFormGroup();
    this.choosenDate = '';
  }

  selectedCategory = signal('');
  isOpen = signal(false);
  dropDownBox = viewChild<ElementRef>('dropdownRef');
  // isNewAnswerAvailable = signal(false);
  isFormValid = output<boolean>();
  private statusSubscription?: Subscription;
  surveyPublished = model<boolean>(false);

  ngOnInit(){
    this.statusSubscription = this.surveyForm.statusChanges.subscribe(status => this.isFormValid.emit(status === 'VALID'));
    this.isFormValid.emit(this.surveyForm.valid);
  }

  ngOnDestroy(){
    if(this.statusSubscription){
      this.statusSubscription.unsubscribe();
      console.log('Abonnement wurde destroyed');
    }
  }

  selectCategory(value:string, event: MouseEvent){
    event.stopPropagation();
    this.selectedCategory.set(value);
    this.isOpen.set(false);
    this.surveyForm.get('surveyCategory')?.setValue(this.selectedCategory());
    // console.log(this.surveyForm.get('surveyCategory')?.value);
  }

  toggleDropdown(){
    if(this.isOpen()){
      this.isOpen.set(false);
    }else{
      this.isOpen.set(true);
    }
  }

  changeDeleteIcon(id:string):string{
    if(this.isHoveredId == id){
      return 'assets/icons/delete_hover.svg';
    }else{
      return 'assets/icons/Delete.svg';
    }
  }

  selectArrowPath():string{
    let path = '';
    if(this.isHoveredArrow && !this.isOpen()){path = 'assets/icons/arrow_drop_down_orange.svg';}
    if(!this.isHoveredArrow && !this.isOpen()){path = 'assets/icons/arrow_drop_down_white.svg';}
    if(this.isOpen()){path = 'assets/icons/arrow_up_orange.svg';}
    return path;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent){
    const dropDownEl = this.dropDownBox()?.nativeElement;
    if(dropDownEl){
      const clickedInsideDropdown = dropDownEl.contains(event.target);
      if(!clickedInsideDropdown){this.isOpen.set(false);}
    }
  }

  addNewQuestion(){
    // this.questionList.push(dummyQuestionObj);
    this.amountQuestions++; 
    this.questions.push(new AnswerModel);
    console.log(this.questions); 
    this.addNewFormGroup();
    console.log(this.surveyForm.value);
    // this.surveyPublished.set(true);
  }

  surveyForm = new FormGroup({
    surveyName: new FormControl('', {nonNullable:true, validators:[Validators.required, Validators.minLength(5)]}),
    surveyEndDate: new FormControl(''),
    surveyCategory: new FormControl('', {validators:[Validators.required]}),
    surveyDescription: new FormControl(''),

    surveyQuestions: new FormArray<FormGroup>([])
  });
  get questionsArray(): FormArray{
    return this.surveyForm.get('surveyQuestions') as FormArray;
  }

  addNewFormGroup(){
    let questionGroup = new FormGroup({
      surveyQuestion: new FormControl('', {validators:[Validators.required, Validators.minLength(5)]}),
      surveyAnswer1: new FormControl('', {validators:[Validators.required, Validators.minLength(2)]}),
      surveyAnswer2: new FormControl('', {validators:[Validators.required, Validators.minLength(2)]}),
      surveyAnswer3: new FormControl(''),
      surveyAnswer4: new FormControl(''),
      surveyAnswer5: new FormControl(''),
      surveyAnswer6: new FormControl(''),
      isMultiple: new FormControl(false)
    });
    this.questionsArray.push(questionGroup);
  }

  transferDate(event: Event){
    let input = event.target as HTMLInputElement;
    this.choosenDate = input.value;
    if(this.choosenDate != ''){
      let [year, month, day] = this.choosenDate.split('-');
      let formattedDate = `${day}.${month}.${year}`;
      this.surveyForm.get('surveyEndDate')?.setValue(formattedDate);
    }
  }

  clearInput(controlName:string){
    this.surveyForm.get(controlName)?.setValue('');
  }

  clearQuestionInput(controlName:string, index:number){
    if(index > 0){
      this.questionsArray.removeAt(index);
    }else{
      let actualFormGroup = this.questionsArray.at(index);
      actualFormGroup.get(controlName)?.setValue('');
    }
  }

  clearAnswerInput(controlName:string, index:number, listNumber:number = 0){
    let actualFormGroup = this.questionsArray.at(index);
    switch(controlName){
      case 'surveyAnswer1':
      case 'surveyAnswer2':
        actualFormGroup.get(controlName)?.setValue('');
        if(this.questions[index].amountAnswers > 0){this.customizeAnswerArr(listNumber, actualFormGroup, controlName, index);}
        break;
      case 'surveyAnswer3':
      case 'surveyAnswer4':
      case 'surveyAnswer5':
      case 'surveyAnswer6':
        actualFormGroup.get(controlName)?.setValue('');
        this.customizeAnswerArr(listNumber, actualFormGroup, controlName, index);
        console.log(this.questions[index].actualList);
        console.log(actualFormGroup.value);
        console.log(listNumber);
        break;
      default:
        actualFormGroup.get(controlName)?.setValue('');
        break;
    }
  }

  customizeAnswerArr(listNumber:number, formGroup:AbstractControl, controlName: string, index:number){
    this.questions[index].actualList.pop();
    this.questions[index].amountAnswers--;
    let arrPos = controlName === 'surveyAnswer1' ? 1
               : controlName === 'surveyAnswer2' ? 2
               : listNumber + 3;
    for (let index = arrPos; index <= 6; index++) {
      if(index < 6){
        let newValue = formGroup.get(`surveyAnswer${index + 1}`)?.value;
        formGroup.get(`surveyAnswer${index}`)?.setValue(newValue);
      }else{
        formGroup.get(`surveyAnswer${index}`)?.setValue('');
      }
    }
  }

  clearInputsAfterPublish(){
    this.clearInput('surveyName');
    this.clearInput('surveyEndDate');
    this.clearInput('surveyCategory');
    this.clearInput('surveyDescription');
    this.clearQuestionInputAfterPublish();
  }

  clearQuestionInputAfterPublish(){
    for (let index = 0; index < this.questionsArray.length; index++) {
      this.clearPublishedInputs('surveyQuestion', index);
      this.clearMultipleInput(index);
      this.clearPublishedInputs('surveyAnswer1', index);
      this.clearPublishedInputs('surveyAnswer2', index);
      this.clearPublishedInputs('surveyAnswer3', index);
      this.clearPublishedInputs('surveyAnswer4', index);
      this.clearPublishedInputs('surveyAnswer5', index);
      this.clearPublishedInputs('surveyAnswer6', index);
    }
  }

  clearPublishedInputs(controlName:string, index:number){
    let actualFormGroup = this.questionsArray.at(index);
    actualFormGroup.get(controlName)?.setValue('');
  }

  clearMultipleInput(arrIndex:number){
    let actualFormGroup = this.questionsArray.at(arrIndex);
    actualFormGroup.get('isMultiple')?.setValue(false);
  }

  toggleMultipleAnswer(index:number){
    let actualFormGroup = this.questionsArray.at(index);
    let value = actualFormGroup.get('isMultiple')?.value;
    actualFormGroup.get('isMultiple')?.setValue(!value);
  }

  changeMultipleIcon(index:number):string{
    let path = '';
    let actualFormGroup = this.questionsArray.at(index);
    let value = actualFormGroup.get('isMultiple')?.value;
    if(!value){
      path = 'assets/icons/white_checkbox.svg';
    }else{
      path = 'assets/icons/answer_checked_new.svg';
    }
    return path;
  }

  async submitFormFromOutside(){
    console.log(this.surveyForm.value);
    this.putFormDataInToObj();
    console.log(this.actualSurvey);
    this.writeDataToSupabase().then((surveyData) => {
      let surveyId = surveyData.id;
      console.log(surveyData);
      this.clearInputsAfterPublish();
      this.surveyPublished.set(true);
      setTimeout(() => {
        this.router.navigate(['/survey', surveyId]);
      }, 3000);
    });
  }

  async writeDataToSupabase(){
    let surveyPromise = this.dbService.setSurvey({name:this.actualSurvey.name, end_date:this.actualSurvey.endDate, category:this.actualSurvey.category, description:this.actualSurvey.description});
    return surveyPromise.then((surveyData) => {
      for (let index = 0; index < this.actualSurvey.questions.length; index++) {
      // let surveyTable = this.dbService.loadSurveysTable();
      this.dbService.setQuestions({
        survey_name:this.actualSurvey.name,
        survey_id: surveyData.id,
        question_number:(index + 1),
        question:this.actualSurvey.questions[index].question,
        answer1:this.actualSurvey.questions[index].answers[0],
        counter1:0,
        answer2:this.actualSurvey.questions[index].answers[1],
        counter2:0,
        answer3:this.actualSurvey.questions[index].answers[2],
        counter3:0,
        answer4:this.actualSurvey.questions[index].answers[3],
        counter4:0,
        answer5:this.actualSurvey.questions[index].answers[4],
        counter5:0,
        answer6:this.actualSurvey.questions[index].answers[5],
        counter6:0,
        is_multiple:this.actualSurvey.questions[index].isMultiple,
        });
      }
      return surveyData;
    });
  }

  putFormDataInToObj(){
    this.actualSurvey.name = this.surveyForm.get('surveyName')?.value ?? '';
    this.actualSurvey.description = this.surveyForm.get('surveyDescription')?.value ?? '';
    this.actualSurvey.endDate = this.choosenDate ? new Date(this.choosenDate) : new Date(1990, 0, 1);
    this.actualSurvey.category = this.surveyForm.get('surveyCategory')?.value ?? '';
    this.putDataFromArrayIntoObj();
  }

  putDataFromArrayIntoObj(){
    for (let index = 0; index < this.questionsArray.length; index++) {
      let actualGroup = this.questionsArray.at(index) as FormGroup;
      this.checkIfEntryExists(index);
      this.actualSurvey.questions[index].question = actualGroup.get('surveyQuestion')?.value ?? '';
      this.actualSurvey.questions[index].isMultiple = actualGroup.get('isMultiple')?.value ?? false;
      for (let i = 0; i <= 5; i++) {
        this.actualSurvey.questions[index].answers.push(actualGroup.get(`surveyAnswer${i + 1}`)?.value);
      }
    }
  }

  checkIfEntryExists(arrIndex:number){
    if(!this.actualSurvey.questions[arrIndex]){
      this.actualSurvey.questions[arrIndex] = {
        question: '',
        isMultiple: false,
        answers: []
      }
    }
  }

  // setQuestionAnswersFromSurvey(){
  //   for (let index = 0; index < this.actualSurvey.questions.length; index++) {
  //     // let surveyTable = this.dbService.loadSurveysTable();
  //     this.dbService.setQuestions({
  //       survey_name:this.actualSurvey.name,
  //       survey_id: surveyTable.id;
  //       question_number:(index + 1),
  //       question:this.actualSurvey.questions[index].question,
  //       answer1:this.actualSurvey.questions[index].answers[0],
  //       counter1:0,
  //       answer2:this.actualSurvey.questions[index].answers[1],
  //       counter2:0,
  //       answer3:this.actualSurvey.questions[index].answers[2],
  //       counter3:0,
  //       answer4:this.actualSurvey.questions[index].answers[3],
  //       counter4:0,
  //       answer5:this.actualSurvey.questions[index].answers[4],
  //       counter5:0,
  //       answer6:this.actualSurvey.questions[index].answers[5],
  //       counter6:0,
  //       is_multiple:this.actualSurvey.questions[index].isMultiple,
  //     });
  //   }
  // }

}
