import { Routes } from '@angular/router';
import { MainPage } from './shared/components/main-page/main-page';
import { CreateSurvey } from './shared/components/create-survey/create-survey';

export const routes: Routes = [
    {path:'', component:MainPage},
    {path:'draft', component:CreateSurvey}
];
