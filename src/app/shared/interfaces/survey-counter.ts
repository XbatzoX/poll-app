export interface SurveyCounter {
    counter1:number;
    counter2:number;
    counter3:number;
    counter4:number;
    counter5:number;
    counter6:number;
}

export const dummyCounterObj:SurveyCounter = {
    "counter1": 0,
    "counter2": 0,
    "counter3": 0,
    "counter4": 0,
    "counter5": 0,
    "counter6": 0
}

export interface ResultValues {
    resultInPercent1: number;
    resultInPercent2: number;
    resultInPercent3: number;
    resultInPercent4: number;
    resultInPercent5: number;
    resultInPercent6: number;
    resultTotal:number;
}

export const dummyResultObj:ResultValues = {
    "resultInPercent1": 0,
    "resultInPercent2": 0,
    "resultInPercent3": 0,
    "resultInPercent4": 0,
    "resultInPercent5": 0,
    "resultInPercent6": 0,
    "resultTotal":0
}
