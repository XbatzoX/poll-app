export interface NewServey {
    name:string;
    endDate:Date;
    category:string;
    description:string;
    question:string;
    isMultiple:boolean;
    answers:string[];
}
