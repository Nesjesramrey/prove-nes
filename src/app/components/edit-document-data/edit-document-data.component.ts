import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: '.edit-document-data-dialog',
  templateUrl: './edit-document-data.component.html',
  styleUrls: ['./edit-document-data.component.scss']
})
export class EditDocumentDataComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public document: any = null;
  public formGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public documentServie: DocumentService
  ) {
    // console.log(this.dialogData);
    this.document = this.dialogData['document'];
    // console.log('document: ', this.document);
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      title: [this.document['title'], [Validators.required]],
      description: [this.document['description'], [Validators.required]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  editDocument(formGroup: FormGroup) {
    this.submitted = true;
    let data: any = {
      documentID: this.document['_id'],
      title: formGroup['value']['title'],
      description: formGroup['value']['description']
    };

    this.documentServie.editDocumentData(data).subscribe({
      error: (error: any) => {
        this.submitted = true;
        // console.log(error);
      },
      next: (reply: any) => {
        this.submitted = true;
        this.dialogRef.close(reply);
      },
      complete: () => { }
    })
  }

  killDialog() {
    this.dialogRef.close();
  }
}
