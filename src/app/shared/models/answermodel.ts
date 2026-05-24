
export class AnswerModel{
    amountAnswers: number;
    letterList = ['C', 'D', 'E', 'F'];
    actualList:string[] = [];
    addAnswerInfo:string;

    constructor(){
        this.amountAnswers = 0;
        this.addAnswerInfo = '';
    }

    addAnswer(){
        if(this.amountAnswers < 4){
            this.actualList.push(this.letterList[this.amountAnswers]);
            this.amountAnswers++;
            //   this.isNewAnswerAvailable.set(true);
            this.addAnswerInfo = 'you can add up to 6 answer fields'
        }
    }

    showAnswerInfo():string{
        return this.addAnswerInfo;
    }
}