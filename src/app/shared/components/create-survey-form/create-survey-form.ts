import { Component, ElementRef, HostListener, output, signal, viewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { dummyQuestionObj, NewSurvey } from '../../interfaces/new-survey';
import { AnswerModel } from '../../models/answermodel';

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
  questionList:NewSurvey[] = [
    {
      "name":'',
      "endDate": new Date(),
      "category":'',
      "description":'',
      "questions": []
    }
  ];
  
  constructor(){
    this.isHoveredId = '';
    this.isHoveredArrow = false;
    this.amountQuestions = 1;
    this.addNewFormGroup();
  }

  selectedCategory = signal('');
  isOpen = signal(false);
  dropDownBox = viewChild<ElementRef>('dropdownRef');
  // isNewAnswerAvailable = signal(false);
  isFormValid = output<boolean>();

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
    this.questionList.push(dummyQuestionObj);
    this.amountQuestions++; 
    this.questions.push(new AnswerModel);
    console.log(this.questions); 
    this.addNewFormGroup();
    console.log(this.surveyForm.value);
    this.isFormValid.emit(true);
  }

  surveyForm = new FormGroup({
    surveyName: new FormControl('', {validators:[Validators.required, Validators.minLength(5)]}),
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
    let choosenDate = input.value;
    if(choosenDate){
      let [year, month, day] = choosenDate.split('-');
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
}
