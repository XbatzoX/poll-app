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
        this.end_date = data.end_date? new Date(data.end_date) : new Date();
        this.category = data.category ?? '';
        this.description = data.description ?? '';
        this.questions = data.questions ?? [];
    }

    get remainingDays():string {
        let today = new Date();
        let start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        let end = new Date(this.end_date.getFullYear(), this.end_date.getMonth(), this.end_date.getDate()).getTime();
        let diffInMs = end - start;
        let diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        return this.createMessage(diffInDays, this.end_date.getFullYear());
    }

    createMessage(diff:number, year:number):string{
        let message = '';
        if(diff == 0){
            message = 'Ends today';
        }else if(diff < 0 && year == 1989){
            message = 'No end date';
        }else if( diff < 0 && year != 1989){
            message = 'Survey expired';
        }else if(diff == 1){
            message = 'Ends in 1 day';
        }else{
            message = `Ends in ${diff} days`;
        }
        return message;
    }
  
}