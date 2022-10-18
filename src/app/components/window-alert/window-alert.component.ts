import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';
import { LayoutService } from 'src/app/services/layout.service';
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
  public layout: any = null;
  public collaborator: any = null;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<WindowAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public documentService: DocumentService,
    public utilityService: UtilityService,
    public layoutService: LayoutService
  ) {
    // console.log(this.dialogData);
    this.windowType = this.dialogData['windowType'];
    switch (this.windowType) {
      case 'useAsCover':
        this.document = this.dialogData['document'];
        break;
      case 'kill-layout':
        this.layout = this.dialogData['layout'];
        break;
      case 'kill-collaborator':
        this.collaborator = this.dialogData['user'];
        break;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  setAsCover() {
    this.submitted = true;

    let data: any = {
      document_id: this.document['_id']
    };

    this.documentService.setDocumentAsCover(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.dialogRef.close();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService.editedSuccess);
        this.dialogRef.close(reply);
      },
      complete: () => {
        this.submitted = false;
      }
    });
  }

  killLayout() {
    this.submitted = true;

    let data: any = {
      layoutID: this.layout['_id'],
      isActive: false
    };

    this.layoutService.editLayoutData(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.dialogRef.close();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService.editedSuccess);
        this.dialogRef.close(reply);
      },
      complete: () => {
        this.submitted = false;
      }
    });
  }

  killDocumentCollaborator() {
    this.submitted = true;
    let data: any = {
      user_id: this.collaborator['_id']
    };
  }

  killDialog() {
    this.dialogRef.close();
  }
}
