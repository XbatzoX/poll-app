import { Component, effect, ElementRef, inject, model, viewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-completed-dialog',
  imports: [],
  templateUrl: './survey-completed-dialog.html',
  styleUrl: './survey-completed-dialog.scss',
})
export class SurveyCompletedDialog {
  isDialogOpen = model<boolean>(false);
  dialogRef = viewChild<ElementRef<HTMLDialogElement>>('publishedDialog');
  router = inject(Router);
  navigate:boolean = false;

  /** This function is used to open the dialog if the survey is completed */
  constructor(){
    effect((onCleanup) => {
      let dialog = this.dialogRef()?.nativeElement;
      if(!dialog) return;
      if(this.isDialogOpen()){
        dialog.showModal();
        let timer = setTimeout(() => {this.isDialogOpen.set(false); this.navigate = true;}, 2000);
        onCleanup(() => {clearTimeout(timer);});
      }else{
        let closeTimer = setTimeout(()=>{
          dialog.close();
          if(this.navigate){
            this.navigate = false;
            this.router.navigate(['']);
          }
        }, 500);
        onCleanup(() => {clearTimeout(closeTimer);});
      }
    });
  }
}
