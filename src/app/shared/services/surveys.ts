import { Injectable,signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { NewSurvey } from '../interfaces/new-survey';
// import { QuestionAnswers } from '../interfaces/new-survey';

@Injectable({
  providedIn: 'root',
})
export class Surveys {
  supabase = createClient('https://xugobnvbgomjpqrwdchx.supabase.co', 'sb_publishable_fu-RXblBL1Xhe2xs73gFOQ_TSB9BU4q');

  surveyList = signal<NewSurvey[]>([]);

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
    let response = await this.supabase
    .from('surveys')
    .select('*');

    this.surveyList.set((response.data ?? []) as NewSurvey[]);
    console.log(this.surveyList());
  }
}
