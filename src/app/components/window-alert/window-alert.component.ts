import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComplaintService } from 'src/app/services/complaint.service';
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
  public complaint: any = null;

  constructor(
    public dialogRef: MatDialogRef<WindowAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public documentService: DocumentService,
    public utilityService: UtilityService,
    public layoutService: LayoutService,
    public complaintService: ComplaintService
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
      case 'complaint':
        this.complaint = this.dialogData['complaint'];
        break;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isDataAvailable = true;
    }, 700);
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

  killComplaint() {
    let data: any = { complaint_id: this.complaint['_id'] };
    this.complaintService.killComplaint(data).subscribe({
      error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
      next: (reply: any) => {
        this.dialogRef.close(reply);
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      },
      complete: () => { }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
