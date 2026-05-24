import { Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dummyQuestionObj, NewSurvey } from '../../interfaces/new-survey';
import { AnswerModel } from '../../models/answermodel';

@Component({
  selector: 'app-create-survey-form',
  imports: [FormsModule],
  templateUrl: './create-survey-form.html',
  styleUrl: './create-survey-form.scss',
})
export class CreateSurveyForm {
  isHoveredId: string;
  isHoveredArrow: boolean;
  categoryList = ['Team Activities', 'Health & Wellness', 'Gaming & Entertainment',
    'Education & Learning', 'Lifestyle & Preferences', 'Technology & Innovation'
  ];
  // amountAnswers: number;
  // letterList = ['C', 'D', 'E', 'F'];
  // actualList:string[] = [];
  // addAnswerInfo:string;
  amountQuestions:number;
  question_1:AnswerModel = new AnswerModel();
  questions:AnswerModel[] = [this.question_1];
  questionList:NewSurvey[] = [
    {
      "name":'',
      "endDate": new Date(),
      "category":'',
      "description":'',
      "question":'',
      "isMultiple":false,
      "answers":['']
    }
  ];
  
  constructor(){
    this.isHoveredId = '';
    this.isHoveredArrow = false;
    // this.amountAnswers = 0;
    // this.addAnswerInfo = '';
    this.amountQuestions = 1;
  }

  selectedCategory = signal('');
  isOpen = signal(false);
  dropDownBox = viewChild<ElementRef>('dropdownRef');
  // isNewAnswerAvailable = signal(false);

  selectCategory(value:string, event: MouseEvent){
    event.stopPropagation();
    this.selectedCategory.set(value);
    this.isOpen.set(false);
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

  // addAnswer(){
  //   if(this.amountAnswers < 4){
  //     this.actualList.push(this.letterList[this.amountAnswers]);
  //     this.amountAnswers++;
  //     this.isNewAnswerAvailable.set(true);
  //     this.addAnswerInfo = 'you can add up to 6 answer fields'
  //   }
  // }

  addNewQuestion(){
    this.questionList.push(dummyQuestionObj);
    this.amountQuestions++; 
    this.questions.push(new AnswerModel);
    console.log(this.questions); 
  }

  createAnswerModel(){
    
  }
}
