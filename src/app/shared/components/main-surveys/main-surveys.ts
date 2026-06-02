import { Component, inject } from '@angular/core';
import { Surveys } from '../../services/surveys';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-surveys',
  imports: [],
  templateUrl: './main-surveys.html',
  styleUrl: './main-surveys.scss',
})
export class MainSurveys {
  dbService = inject(Surveys);
  router = inject(Router);

  ngOnInit(){
    this.dbService.getAllSurveys();
  }

  openSurvey(index:number){
    let name = this.dbService.sortedSurveys()[index].name;
    this.router.navigate(['/survey', name]);
  }
}
