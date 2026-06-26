import { Component, signal, ElementRef, viewChild, HostListener, inject, computed } from '@angular/core';
import { Surveys } from '../../services/surveys';
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

  /** This computed signal sorts the active surveys into an array of SurveyModel */
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

  /**  This computed signal sorts the past surveys into an array of SurveyModel */
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

  /** This computed signal sorts the surveys corresponding of choosen category */
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

  /** This function is used to load all surveys from database */
  ngOnInit(){
     this.dbService.getAllSurveys();
  }

  /**
   * This function is used to toggle the value of signal
   * @param name - includes the value of clicked button
   */
  toggleListedSurveys(name:string){
    if(name == 'active'){
      this.isActiveSurvey.set(true);
      this.isPastSurvey.set(false);
    }else{
      this.isActiveSurvey.set(false);
      this.isPastSurvey.set(true);
    }
  }

  /** This function is used to choose the correct arrow image of category arrow button */
  selectArrowPath():string{
    let path = '';
    if(this.isHoveredArrow && !this.isListOpen()){path = 'assets/icons/arrow_drop_down_orange.svg';}
    if(!this.isHoveredArrow && !this.isListOpen()){path = 'assets/icons/arrow_drop_down_white.svg';}
    if(this.isListOpen()){path = 'assets/icons/arrow_up_orange.svg';}
    return path;
  }

  /** This function is used to to open and close the drop down list of categories */
  toggleDropdown(){
    if(this.isListOpen()){
      this.isListOpen.set(false);
    }else{
      this.isListOpen.set(true);
    }
  }

  /**
   * This function select the choosen category
   * @param value -includes the name of category
   * @param event - includes mouse event (event bubbling)
   */
  selectCategory(value:string, event: MouseEvent){
    event.stopPropagation();
    this.isListOpen.set(false);
    this.selectedCategory.set(value);
  }

  /** This host listener ist used to close the drop down list if the user clicks somewhere on page */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent){
    const dropDownEl = this.dropDownBox()?.nativeElement;
    if(dropDownEl){
      const clickedInsideDropdown = dropDownEl.contains(event.target);
      if(!clickedInsideDropdown){this.isListOpen.set(false);}
    }
  }

  /**
   * This function is used to navigate to choosen active survey
   * @param index - includes the index number of array
   */
  openActiveSurvey(index:number){
    let surveyId = this.activeSurveys()[index].id;
    this.router.navigate(['/survey', surveyId]);
  }

  /**
   * This function is used to navigate to choosen past survey
   * @param index - includes the index number of array
   */
   openPastSurvey(index:number){
    let surveyId = this.pastSurveys()[index].id;
    this.router.navigate(['/survey', surveyId]);
  }
}
