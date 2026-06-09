import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-listed-surveys',
  imports: [],
  templateUrl: './listed-surveys.html',
  styleUrl: './listed-surveys.scss',
})
export class ListedSurveys {
  isHoveredArrow: boolean;
  categoryList = ['Team Activities', 'Health & Wellness', 'Gaming & Entertainment',
    'Education & Learning', 'Lifestyle & Preferences', 'Technology & Innovation'
  ];
  isActiveSurvey = signal<boolean>(false);
  isPastSurvey = signal<boolean>(false);

  constructor(){
    this.isHoveredArrow = false;
    this.isActiveSurvey.set(true);
    
  }

  toggleListedSurveys(name:string){
    if(name == 'active'){
      this.isActiveSurvey.set(true);
      this.isPastSurvey.set(false);
    }else{
      this.isActiveSurvey.set(false);
      this.isPastSurvey.set(true);
    }
  }
}
