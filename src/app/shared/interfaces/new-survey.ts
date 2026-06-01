export interface NewSurvey {
    name:string;
    endDate:Date;
    category:string;
    description:string;
    questions:QuestionAnswers[];
}

export interface QuestionAnswers {
    question: string;
    isMultiple:boolean;
    answers:string[];
}

export const dummyQuestionObj:NewSurvey = {
    "name":'',
    "endDate": new Date(),
    "category":'',
    "description":'',
    "questions": []
}

export interface LoadedQuestions {
    id: number;
    question_number:number;
    question: string;
    survey_name:string;
    answer1: string;
    counter1:number;
    answer2: string;
    counter2:number;
    answer3: string;
    counter3:number;
    answer4: string;
    counter4:number;
    answer5: string;
    counter5:number;
    answer6: string;
    counter6:number;
    is_multiple:boolean;
}

export interface LoadedSurveys {
    id: number;
    name: string;
    end_date:Date;
    category:string;
    description:string;
    questions:LoadedQuestions[];
}
