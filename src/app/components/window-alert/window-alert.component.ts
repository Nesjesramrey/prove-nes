import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComplaintService } from 'src/app/services/complaint.service';
import { DocumentService } from 'src/app/services/document.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SolutionService } from 'src/app/services/solution.service';
import { TopicService } from 'src/app/services/topic.service';
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
  public topic: any = null;
  public solution: any = null;

  constructor(
    public dialogRef: MatDialogRef<WindowAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public documentService: DocumentService,
    public utilityService: UtilityService,
    public layoutService: LayoutService,
    public complaintService: ComplaintService,
    public topicService: TopicService,
    public solutionService: SolutionService
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
      case 'kill-topic':
        this.topic = this.dialogData['topic'];
        break;
      case 'kill-solution':
        this.solution = this.dialogData['solution'];
        break;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isDataAvailable = true;
    }, 300);
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
      layoutID: this.layout['id'],
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

  killTopic() {
    let data: any = {
      topic_id: this.topic['_id'],
      isActive: false
    }

    this.topicService.killTopic(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
        this.dialogRef.close(reply);
      },
      complete: () => { }
    });
  }

  killSolution() {
    let data: any = {
      solution_id: this.solution['_id'],
      isActive: false
    }

    this.solutionService.killSolution(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
        this.dialogRef.close(reply);
      },
      complete: () => { }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
