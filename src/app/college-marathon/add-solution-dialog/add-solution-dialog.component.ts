import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: '.add-solution-dialog',
  templateUrl: './add-solution-dialog.component.html',
  styleUrls: ['./add-solution-dialog.component.scss']
})
export class AddSolutionDialogComponent implements OnInit {
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
  public solutionFG!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddSolutionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.solutionFG = this.formBuilder.group({
      description: ['', [Validators.required]]
    });
  }

  killDialog() {
    this.dialogRef.close();
  }

  saveDescription(form: FormGroup) { }
}
