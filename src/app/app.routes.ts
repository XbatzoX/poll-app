import { Routes } from '@angular/router';
import { MainPage } from './shared/components/main-page/main-page';
import { CreateSurvey } from './shared/components/create-survey/create-survey';
import { SurveyView } from './shared/components/survey-view/survey-view';

export const routes: Routes = [
    {path:'', component:MainPage},
    {path:'draft', component:CreateSurvey},
    {path:'survey/:id', component:SurveyView,}
];
