import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SolutionService } from 'src/app/services/solution.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: '.edit-solution-data',
  templateUrl: './edit-solution-data.component.html',
  styleUrls: ['./edit-solution-data.component.scss']
})
export class EditSolutionDataComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public solution: any = null;
  public formGroup!: FormGroup;
  public submitted: boolean = false;
  public htmlContent: any = '';
  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Descripción...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
      ],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  constructor(
    public dialogRef: MatDialogRef<EditSolutionDataComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public solutionService: SolutionService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.solution = this.dialogData['solution'];
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      title: [this.solution['title'], [Validators.required]],
      description: [this.solution['description'], [Validators.required]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  editSolution(formGroup: FormGroup) {
    this.submitted = true;
    let data: any = {
      solution_id: this.solution['_id'],
      title: formGroup['value']['title'],
      description: formGroup['value']['description']
    };
    this.solutionService.updateSolutionData(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.killDialog();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
        this.dialogRef.close(reply);
      },
      complete: () => {
        this.submitted = false;
      }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
