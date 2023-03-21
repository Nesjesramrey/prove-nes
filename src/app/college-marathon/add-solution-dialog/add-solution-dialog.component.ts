import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SolutionService } from 'src/app/services/solution.service';
import { UtilityService } from 'src/app/services/utility.service';

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
  public user: any = null;
  public solution: any = null;

  constructor(
    public dialogRef: MatDialogRef<AddSolutionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public solutionService: SolutionService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.user = this.dialogData['user'];
    // console.log('user: ', this.user);
    this.solution = this.dialogData['solution'];
    // console.log('solution: ', this.solution);
  }

  ngOnInit(): void {
    this.solutionFG = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
    this.solutionFG.patchValue({ title: this.solution['title'] });
    this.solutionFG.patchValue({ description: this.solution['description'] });
  }

  killDialog() {
    this.dialogRef.close();
  }

  editSolution(form: FormGroup) {
    this.submitted = true;
    let data: any = {
      solution_id: this.solution['_id'],
      title: form['value']['title'],
      description: form['value']['description']
    };
    this.solutionService.updateSolutionData(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.solution['title'] = reply['title'];
        this.solution['description'] = reply['description'];
      },
      complete: () => {
        this.submitted = false;
        this.dialogRef.close(this.solution);
      }
    });
  }
}
