import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ComplaintService } from 'src/app/services/complaint.service';
import { UtilityService } from 'src/app/services/utility.service';
import { UserService } from 'src/app/services/user.service';

import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { VoteDialogComponent } from 'src/app/components/vote-dialog/vote-dialog.component';


@Component({
  selector: '.single-complaint',
  templateUrl: './single-complaint.component.html',
  styleUrls: ['./single-complaint.component.scss']
})
export class SingleComplaintComponent implements OnInit {
  public complaintID: string = '';
  public isMobile: boolean = false;
  public isDataAvailable: boolean = false;
  public complaint: any = null;
  public user: any = null;
  public card: any[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public deviceDetectorService: DeviceDetectorService,
    public complaintService: ComplaintService,
    public utilityService: UtilityService,
    public userService: UserService,
    public matBottomSheet: MatBottomSheet,
    public dialog: MatDialog

  ) {
    this.complaintID = this.activatedRoute['snapshot']['params']['complaintID'];
    this.isMobile = this.deviceDetectorService.isMobile();
    // console.log(this.complaintID);
  }

  ngOnInit(): void {
    this.userService.fetchFireUser().subscribe({
      error: (error: any) => { },
      next: (reply: any) => { this.user = reply; },
      complete: () => { }
    });

    let complaint: Observable<any> = this.complaintService.fetchComplaintById({ complaintID: this.complaintID });
    forkJoin([complaint]).subscribe((reply: any) => {
      // console.log(reply);
      this.complaint = reply[0];
      //console.log(this.complaint);
      this.card = [this.complaint];
      this.card.filter((x: any) => { x['comments'] = []; });
      //console.log(this.card);

      setTimeout(() => {
        this.isDataAvailable = true;
      });
    });
  }

  shareCard() {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: null,
        
      }
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  openVoteDialog(post: any) {
    const dialogRef = this.dialog.open<any>(VoteDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {
        post: post['_id']
      },
    });

    dialogRef.afterClosed().subscribe((reply: any) => { });
  }

  
  postComment(event: any, card: any) {
    if (event.keyCode === 13) {
      card['comments'].push(event.target.value);
    }
  }
}
