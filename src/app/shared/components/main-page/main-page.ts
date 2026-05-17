import { Component } from '@angular/core';
import { MainCaption } from '../main-caption/main-caption';
import { MainSurveys } from "../main-surveys/main-surveys";

@Component({
  selector: 'app-main-page',
  imports: [MainCaption, MainSurveys],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {}
