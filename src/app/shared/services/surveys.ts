import { Injectable,signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { LoadedSurveys, NewSurvey } from '../interfaces/new-survey';
import { SurveyModel } from '../models/surveymodel';
// import { QuestionAnswers } from '../interfaces/new-survey';

@Injectable({
  providedIn: 'root',
})
export class Surveys {
  supabase = createClient('https://xugobnvbgomjpqrwdchx.supabase.co', 'sb_publishable_fu-RXblBL1Xhe2xs73gFOQ_TSB9BU4q');

  surveyList = signal<SurveyModel[]>([]);
  fullSurveys:SurveyModel[]= [];
  

  async setSurvey(surveyData:{name:string, end_date:Date, category:string, description:string}){
    const { error } = await this.supabase
    .from('surveys')
    .insert([surveyData])
  }

  async setQuestions(questionData:{survey_name:string, question_number:number, question:string, answer1:string, counter1:number, answer2:string, counter2:number,
    answer3:string, counter3:number, answer4:string, counter4:number, answer5:string, counter5:number, answer6:string, counter6:number, is_multiple:boolean
  }){
    const { error } = await this.supabase
    .from('questions')
    .insert([questionData]);
  }

  async getAllSurveys(){
    let response = await this.loadSurveysTable();
    let responseData = response.data ?? [];
    let questionsResponse = await this.loadQuestionsTable();
    let questionsResponseData = questionsResponse.data ?? [];

    this.fullSurveys = responseData.map(survey => {
      let rawData = {
        ...survey, 
        questions: questionsResponseData.filter(q => q.survey_name === survey.name)
      };

        return new SurveyModel(rawData);
    });
    
    // this.surveyList.set();
    console.log(this.fullSurveys);
  }

  async loadSurveysTable(){
    let response = await this.supabase
    .from('surveys')
    .select(`id, name, end_date, category, description`);

    return response;
  }

  async loadQuestionsTable(){
    let response = await this.supabase
    .from('questions')
    .select(`id, survey_name, question_number, question, answer1, counter1,
      answer2, counter2, answer3, counter3, answer4, counter4, answer5, counter5,
      answer6, counter6, is_multiple`);

    return response;
  }

  cleanDataFromSupabase(){
    for (let index = 0; index < this.fullSurveys.length; index++) {
      let dataOfSurvey = new SurveyModel();
      dataOfSurvey.id = this.fullSurveys[index].id ?? 0;
    }
  }
}
