import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AddDocumentThemeComponent } from '../add-document-theme/add-document-theme.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestimonyService } from 'src/app/services/testimony.service';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';

@Component({
  selector: 'app-add-document-testimony',
  templateUrl: './add-document-testimony.component.html',
  styleUrls: ['./add-document-testimony.component.scss'],
})
export class AddDocumentTestimonyComponent implements OnInit {
  public addTestimonyFormGroup!: FormGroup;
  public imageUrl: string | null = null;
  public submitted = false;
  public file: any = null;
  public messageError: boolean = false;
  public isAnonymous: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDocumentThemeComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public testimonyService: TestimonyService
  ) { }

  ngOnInit(): void {
    this.addTestimonyFormGroup = this.formBuilder.group({
      description: ['', [Validators.required]],
      image: ['', []],
    });
  }

  killDialog() {
    this.dialogRef.close();
  }

  visibility() {
    this.isAnonymous = !this.isAnonymous;
  }

  handleSelectImage(event: any) {
    if (event == null) return;

    const file = (event.target as HTMLInputElement)?.files![0];
    this.file = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  createTestimony(formGroup: FormGroup) {
    try {
      if (this.addTestimonyFormGroup.valid) {
        this.submitted = true;
        const { description } = formGroup.value;
        const { topicID, type } = this.dialogData;

        const formData = new FormData();
        formData.append('description', description);
        formData.append('files', this.file);
        formData.append('isAnonymous', (!this.isAnonymous).toString());

        const data = {
          form: formData,
          id: topicID,
          type: type
        };

        this.testimonyService
          .createNewTestimony(data)
          .subscribe((reply: any) => {
            this.submitted = false;
            this.dialogRef.close(reply);
          });
      } else {
        this.messageError = true;
      }
    } catch (error) {
      this.diagloErrorOpen();
    }
  }

  diagloErrorOpen() {
    const dialogRef = this.dialog.open<DialogErrorComponent>(
      DialogErrorComponent,
      {
        width: '550px',
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => { });
  }
}
