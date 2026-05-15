import { Component } from '@angular/core';
import { MainCaption } from '../main-caption/main-caption';

@Component({
  selector: 'app-main-page',
  imports: [MainCaption],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {}
