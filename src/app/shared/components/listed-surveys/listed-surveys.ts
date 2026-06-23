import { Component, signal, ElementRef, viewChild, HostListener, inject, computed } from '@angular/core';
import { Surveys } from '../../services/surveys';
import { SurveyModel } from '../../models/surveymodel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listed-surveys',
  imports: [],
  templateUrl: './listed-surveys.html',
  styleUrl: './listed-surveys.scss',
})
export class ListedSurveys {
  isHoveredArrow: boolean;
  categoryList = ['All Surveys', 'Team Activities', 'Health & Wellness', 'Gaming & Entertainment',
    'Education & Learning', 'Lifestyle & Preferences', 'Technology & Innovation'
  ];
  isActiveSurvey = signal<boolean>(false);
  isPastSurvey = signal<boolean>(false);
  isListOpen = signal<boolean>(false);
  selectedCategory = signal<string>('All Surveys');
  dropDownBox = viewChild<ElementRef>('dropdownRef');
  dbService = inject(Surveys);
  router = inject(Router);
  today:Date = new Date();

  activeSurveys = computed(() => {
    let allSurveys = this.dbService.surveyList();
    let todayMidnight = new Date(this.today.getTime());
    todayMidnight.setHours(0, 0, 0, 0);
    return allSurveys.filter(survey => {
      let surveyEndDate = new Date(survey.end_date);
      surveyEndDate.setHours(0, 0, 0, 0);
      return ((surveyEndDate >= todayMidnight) || (survey.end_date.getFullYear() == 1989));
    });
  });

  pastSurveys = computed(() => {
    let allSurveys = this.dbService.surveyList();
    let todayMidnight = new Date(this.today.getTime());
    todayMidnight.setHours(0, 0, 0, 0);
    return allSurveys.filter(survey => {
      let surveyEndDate = new Date(survey.end_date);
      surveyEndDate.setHours(0, 0, 0, 0);
      return ((surveyEndDate < todayMidnight) && (survey.end_date.getFullYear() != 1989));
    });
  });

  filteredSurveys = computed(() => {
    let surveys;
    if(this.isActiveSurvey()){
      surveys = this.activeSurveys();
    }else{
      surveys = this.pastSurveys();
    }
    let category = this.selectedCategory();
    if(category == 'All Surveys'){
      return surveys;
    }else{
      return surveys.filter(survey => (survey.category == category));
    }
  });

  constructor(){
    this.isHoveredArrow = false;
    this.isActiveSurvey.set(true);
   
  }

  ngOnInit(){
     this.dbService.getAllSurveys();
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

  selectArrowPath():string{
    let path = '';
    if(this.isHoveredArrow && !this.isListOpen()){path = 'assets/icons/arrow_drop_down_orange.svg';}
    if(!this.isHoveredArrow && !this.isListOpen()){path = 'assets/icons/arrow_drop_down_white.svg';}
    if(this.isListOpen()){path = 'assets/icons/arrow_up_orange.svg';}
    return path;
  }

  toggleDropdown(){
    if(this.isListOpen()){
      this.isListOpen.set(false);
    }else{
      this.isListOpen.set(true);
    }
  }

  selectCategory(value:string, event: MouseEvent){
    event.stopPropagation();
    this.isListOpen.set(false);
    this.selectedCategory.set(value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent){
    const dropDownEl = this.dropDownBox()?.nativeElement;
    if(dropDownEl){
      const clickedInsideDropdown = dropDownEl.contains(event.target);
      if(!clickedInsideDropdown){this.isListOpen.set(false);}
    }
  }

  showActive(){
    // console.log(this.activeSurveys());
    console.log(this.pastSurveys());
  }

  openActiveSurvey(index:number){
    let surveyId = this.activeSurveys()[index].id;
    this.router.navigate(['/survey', surveyId]);
  }

   openPastSurvey(index:number){
    let surveyId = this.pastSurveys()[index].id;
    this.router.navigate(['/survey', surveyId]);
  }
}
