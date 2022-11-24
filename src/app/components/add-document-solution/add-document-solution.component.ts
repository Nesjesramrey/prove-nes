import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SolutionService } from 'src/app/services/solution.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-document-solution',
  templateUrl: './add-document-solution.component.html',
  styleUrls: ['./add-document-solution.component.scss'],
})
export class AddDocumentSolutionComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public imageUrl: string | null = null;
  public addSolutionFormGroup!: FormGroup;
  public submitted: boolean = false;
  public fileNames: any = [];
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
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
        'fontName'
      ],
      [
        'fontSize',
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
    public dialogRef: MatDialogRef<AddDocumentSolutionComponent>,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    public solutionService: SolutionService,
    public utilityService: UtilityService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.addSolutionFormGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      files: ['', []],
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  killDialog() {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    Array.from(event.target.files).forEach((file: any) => { this.fileNames.push(file['name']); });
    this.addSolutionFormGroup.patchValue({ files: event.target.files });
    this.addSolutionFormGroup.updateValueAndValidity();
  }

  onCreateSolution(form: FormGroup) {
    this.submitted = true;

    let data: any = {
      formData: new FormData(),
      topic: this.dialogData['themeID'],
    };

    Array.from(this.addSolutionFormGroup.controls['files']['value'])
      .forEach((file: any) => { data['formData'].append('files', file); });
    data['formData'].append('title', form['value']['title']);
    data['formData'].append('description', form['value']['description']);
    data['formData'].append('coverage', JSON.stringify(this.dialogData['coverage']['_id']));

    this.solutionService.createNewSolution(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.killDialog();
      },
      next: (reply: any) => {
        this.dialogRef.close(reply);
      },
      complete: () => {
        this.submitted = false;
      }
    });
  }
}
