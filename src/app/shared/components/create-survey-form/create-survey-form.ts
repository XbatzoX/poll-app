import { Component, ElementRef, HostListener, output, signal, viewChild, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { dummyQuestionObj, NewSurvey, QuestionAnswers } from '../../interfaces/new-survey';
import { AnswerModel } from '../../models/answermodel';
import { Subscription } from 'rxjs';

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
      surveyAnswer6: new FormControl('')
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
    let actualFormGroup = this.questionsArray.at(index);
    actualFormGroup.get(controlName)?.setValue('');
  }

  submitFormFromOutside(){
    console.log(this.surveyForm.value);
    this.putFormDataInToObj();
    console.log(this.actualSurvey);
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
      this.actualSurvey.questions[index].isMultiple = false;
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

}
