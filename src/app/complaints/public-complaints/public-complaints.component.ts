import { Component, HostBinding, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ComplaintService } from 'src/app/services/complaint.service';
import { UserService } from 'src/app/services/user.service';
import { VoteDialogComponent } from 'src/app/components/vote-dialog/vote-dialog.component';
import { UtilityService } from 'src/app/services/utility.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'public-complaints',
  templateUrl: './public-complaints.component.html',
  styleUrls: ['./public-complaints.component.scss']
})
export class PublicComplaintsComponent implements OnInit {
  public isMobile: boolean = false;
  public isDataAvailable: boolean = false;
  public complaints: any = null;
  public cards: any[] = [];
  public user: any = null;
  @HostBinding('class') public class: string = '';

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public authenticationService: AuthenticationService,
    public complaintService: ComplaintService,
    public userService: UserService,
    public utilityService: UtilityService,
    public matBottomSheet: MatBottomSheet,
    public dialog: MatDialog
  ) {
    // console.log(this.authenticationService.isAuthenticated);
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    this.userService.fetchFireUser().subscribe({
      error: (error: any) => { },
      next: (reply: any) => { this.user = reply; },
      complete: () => { }
    });

   
    let complaints: Observable<any> = this.complaintService.fetchAllComplaints();

    forkJoin([ complaints]).subscribe((reply: any) => {
      this.complaints = reply[0];
      this.complaints.filter((x: any) => { x['type'] = 'Denuncia'; });
      this.cards = [...this.complaints];
      this.cards.filter((x: any) => { x['comments'] = []; });
      //console.log(this.cards);
      this.isDataAvailable = true;
    });
  }

  postComment(event: any, card: any) {
    if (event.keyCode === 13) {
      card['comments'].push(event.target.value);
    }
  }

  shareCard(card: any) {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: null,
        card: card
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
}
