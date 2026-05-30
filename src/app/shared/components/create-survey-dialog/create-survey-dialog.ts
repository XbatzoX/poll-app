import { Component, effect, ElementRef, model, viewChild } from '@angular/core';

@Component({
  selector: 'app-create-survey-dialog',
  imports: [],
  templateUrl: './create-survey-dialog.html',
  styleUrl: './create-survey-dialog.scss',
})
export class CreateSurveyDialog {
  isDialogOpen = model<boolean>(false);
  dialogRef = viewChild<ElementRef<HTMLDialogElement>>('publishedDialog');

  constructor(){
    effect((onCleanup) => {
      let dialog = this.dialogRef()?.nativeElement;
      if(!dialog) return;
      if(this.isDialogOpen()){
        dialog.showModal();
        let timer = setTimeout(() => {this.isDialogOpen.set(false);}, 2000);
        onCleanup(() => {clearTimeout(timer);});
      }else{
        let closeTimer = setTimeout(()=>{dialog.close();}, 500);
        onCleanup(() => {clearTimeout(closeTimer);});
      }
    });
  }
}
