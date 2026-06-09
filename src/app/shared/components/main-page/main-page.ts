import { Component } from '@angular/core';
import { MainCaption } from '../main-caption/main-caption';
import { MainSurveys } from "../main-surveys/main-surveys";
import { ListedSurveys } from '../listed-surveys/listed-surveys';

@Component({
  selector: 'app-main-page',
  imports: [MainCaption, MainSurveys, ListedSurveys],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {}
