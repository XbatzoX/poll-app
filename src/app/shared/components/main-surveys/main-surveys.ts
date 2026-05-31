import { Component, inject } from '@angular/core';
import { Surveys } from '../../services/surveys';

@Component({
  selector: 'app-main-surveys',
  imports: [],
  templateUrl: './main-surveys.html',
  styleUrl: './main-surveys.scss',
})
export class MainSurveys {
  dbService = inject(Surveys);

  ngOnInit(){
    this.dbService.getAllSurveys();
  }
}
