import { Component, HostBinding, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { ShareSheetComponent } from '../components/share-sheet/share-sheet.component';
import { AuthenticationService } from '../services/authentication.service';
import { ComplaintService } from '../services/complaint.service';
import { TestimonyService } from '../services/testimony.service';
import { UserService } from '../services/user.service';
import { VoteDialogComponent } from '../components/vote-dialog/vote-dialog.component';
import { UtilityService } from '../services/utility.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: '.posts-page',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  public isMobile: boolean = false;
  public isDataAvailable: boolean = false;
  public testimonials: any = null;
  public complaints: any = null;
  public cards: any[] = [];
  public user: any = null;
  @HostBinding('class') public class: string = '';
  public today: any = null;

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public authenticationService: AuthenticationService,
    public testimonyService: TestimonyService,
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
    this.today = new Date();

    this.userService.fetchFireUser().subscribe({
      error: (error: any) => { },
      next: (reply: any) => { this.user = reply; },
      complete: () => { }
    });

    let testimonials: Observable<any> = this.testimonyService.fetchAllTestimonies();
    let complaints: Observable<any> = this.complaintService.fetchAllComplaints();

    forkJoin([testimonials, complaints]).subscribe((reply: any) => {
      this.testimonials = reply[0];
      // this.testimonials = [];
      this.testimonials.filter((x: any) => { x['type'] = 'Testimonio'; });

      this.complaints = reply[1];
      this.complaints.filter((x: any) => { x['type'] = 'Denuncia'; });

      this.cards = [...this.testimonials, ...this.complaints];
      this.cards.filter((x: any) => { x['comments'] = []; });
      console.log(this.cards);
      this.cards.sort(() => Math.random() - 0.5);
      this.cards.filter((x: any) => {
        let date = new Date(x['createdAt']);
      });
      // console.log(this.cards);

      this.isDataAvailable = true;
    });
  }

  postComment(event: any, card: any) {
    if (event.keyCode === 13) {
      console.log(this.user);
      let obj: any = {
        message: event['target']['value'],
        createdBy: this.user
      }
      card['comments'].push(obj);
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
