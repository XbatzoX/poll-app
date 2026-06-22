import { computed, Injectable,signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { LoadedSurveys, NewSurvey } from '../interfaces/new-survey';
import { SurveyModel } from '../models/surveymodel';
import { SurveyCounter } from '../interfaces/survey-counter';
// import { QuestionAnswers } from '../interfaces/new-survey';

@Injectable({
  providedIn: 'root',
})
export class Surveys {
  supabase = createClient('https://xugobnvbgomjpqrwdchx.supabase.co', 'sb_publishable_fu-RXblBL1Xhe2xs73gFOQ_TSB9BU4q');

  surveyList = signal<SurveyModel[]>([]);
  fullSurveys:SurveyModel[]= [];
  sortedSurveys = computed(() => {
    let today = new Date();
    let todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    return [...this.surveyList()]
      .filter(survey => {
        let surveyTime = new Date(survey.end_date).getTime();
        return surveyTime >= todayMidnight;
      })
      .sort((a, b) => {
        let timeA = new Date(a.end_date).getTime();
        let timeB = new Date(b.end_date).getTime();
        return (timeA - timeB);
      })
  });
  

  async setSurvey(surveyData:{name:string, end_date:Date, category:string, description:string}){
    const { data, error } = await this.supabase
    .from('surveys')
    .insert([surveyData])
    .select()
    .single();

    if(error) throw error;
    return data;
  }

  async setQuestions(questionData:{survey_name:string, survey_id:number, question_number:number, question:string, answer1:string, counter1:number, answer2:string, counter2:number,
    answer3:string, counter3:number, answer4:string, counter4:number, answer5:string, counter5:number, answer6:string, counter6:number, is_multiple:boolean
  }){
    const { error } = await this.supabase
    .from('questions')
    .insert([questionData])
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
    
    this.surveyList.set(this.fullSurveys);
    console.log(this.surveyList());
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

  async updateQuestionsTable(data:SurveyCounter, name:string, questionNumber:number){
    const { error } = await this.supabase
    .from('questions')
    .update(data)
    .eq('survey_name', name)
    .eq('question_number', questionNumber)
    .select();
  }
}
