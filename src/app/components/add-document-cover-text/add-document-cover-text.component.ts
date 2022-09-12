import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.add-document-cover-text',
  templateUrl: './add-document-cover-text.component.html',
  styleUrls: ['./add-document-cover-text.component.scss']
})
export class AddDocumentCoverTextComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public document: any = null;
  public formGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddDocumentCoverTextComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public documentService: DocumentService,
    public utilityService: UtilityService
  ) {
    console.log(this.dialogData);
    this.document = this.dialogData['document'];
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      description: [this.document['coverDescription'], [Validators.required]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  addDocumentCoverText(formGroup: FormGroup) {
    let data: any = {
      documentID: this.document['_id'],
      coverDescription: formGroup['value']['description']
    };
    this.documentService.editDocumentData(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar('¡Oops!... Ocurrió un error, inténtalo más tarde.');
        this.dialogRef.close();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar('El docuento se actualizó correctamnete.');
        this.dialogRef.close(reply);
      },
      complete: () => { }
    })
  }

  killDialog() {
    this.dialogRef.close();
  }
}
