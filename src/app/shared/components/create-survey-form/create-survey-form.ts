import { Component } from '@angular/core';

@Component({
  selector: 'app-create-survey-form',
  imports: [],
  templateUrl: './create-survey-form.html',
  styleUrl: './create-survey-form.scss',
})
export class CreateSurveyForm {
  isHoveredId: string;

  constructor(){
    this.isHoveredId = '';
  }

  changeDeleteIcon(id:string):string{
    if(this.isHoveredId == id){
      return 'assets/icons/delete_hover.svg';
    }else{
      return 'assets/icons/Delete.svg';
    }
  }
}
