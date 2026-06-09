import { Component, signal, ElementRef, viewChild, HostListener } from '@angular/core';

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
  isListOpen = signal<boolean>(false);
  dropDownBox = viewChild<ElementRef>('dropdownRef');

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
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent){
    const dropDownEl = this.dropDownBox()?.nativeElement;
    if(dropDownEl){
      const clickedInsideDropdown = dropDownEl.contains(event.target);
      if(!clickedInsideDropdown){this.isListOpen.set(false);}
    }
  }
}
