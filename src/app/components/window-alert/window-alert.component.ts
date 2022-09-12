import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.window-alert',
  templateUrl: './window-alert.component.html',
  styleUrls: ['./window-alert.component.scss']
})
export class WindowAlertComponent implements OnInit {
  public windowType: any = null;
  public isDataAvailable: boolean = false;
  public document: any = null;

  constructor(
    public dialogRef: MatDialogRef<WindowAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public documentService: DocumentService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.windowType = this.dialogData['windowType'];
    switch (this.windowType) {
      case 'useAsCover':
        this.document = this.dialogData['document'];
        break;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  setAsCover() {
    let data: any = {
      document_id: this.document['_id']
    };

    this.documentService.setDocumentAsCover(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar('¡Oops!... Ocurrió un error, inténtalo más tarde.');
        this.dialogRef.close();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar('Se actualizó el documento correctamente.');
        this.dialogRef.close(reply);
      },
      complete: () => { }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
