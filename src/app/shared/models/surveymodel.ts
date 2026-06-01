import { LoadedSurveys, LoadedQuestions } from "../interfaces/new-survey";

export class SurveyModel implements LoadedSurveys {
    id: number;
    name: string;
    end_date:Date;
    category:string;
    description:string;
    questions:LoadedQuestions[];

    constructor(data: Partial<LoadedSurveys> = {}){
        this.id = data.id ?? 0;
        this.name = data.name ?? '';
        this.end_date = data.end_date ?? new Date();
        this.category = data.category ?? '';
        this.description = data.description ?? '';
        this.questions = data.questions ?? [];
    }

    getCleanJson(){
    return {
      
    };
  }
}