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
