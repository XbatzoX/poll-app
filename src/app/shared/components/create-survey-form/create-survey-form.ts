import { Component } from '@angular/core';

@Component({
  selector: 'app-create-survey-form',
  imports: [],
  templateUrl: './create-survey-form.html',
  styleUrl: './create-survey-form.scss',
})
export class CreateSurveyForm {
  isHovered: boolean;

  constructor(){
    this.isHovered = false;
  }

  changeDeleteIcon():string{
    if(this.isHovered){
      return 'assets/icons/delete_hover.svg';
    }else{
      return 'assets/icons/Delete.svg';
    }
  }
}
