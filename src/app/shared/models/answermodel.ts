
export class AnswerModel{
    amountAnswers: number;
    letterList = ['C', 'D', 'E', 'F'];
    actualList:string[] = [];
    addAnswerInfo:string;

    constructor(){
        this.amountAnswers = 0;
        this.addAnswerInfo = '';
    }

    /** This function is used to add an answer of question */
    addAnswer(){
        if(this.amountAnswers < 4){
            this.actualList.push(this.letterList[this.amountAnswers]);
            this.amountAnswers++;
            this.addAnswerInfo = 'you can add up to 6 answer fields'
        }
    }

    /** This function is used to show the max amount of answers info */
    showAnswerInfo():string{
        return this.addAnswerInfo;
    }
}