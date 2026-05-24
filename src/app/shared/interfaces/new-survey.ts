export interface NewSurvey {
    name:string;
    endDate:Date;
    category:string;
    description:string;
    question:string;
    isMultiple:boolean;
    answers:string[];
}

export const dummyQuestionObj:NewSurvey = {
    "name":'',
    "endDate": new Date(),
    "category":'',
    "description":'',
    "question":'',
    "isMultiple":false,
    "answers":['']
}
