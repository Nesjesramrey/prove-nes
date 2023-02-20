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
import { SinglePostDialogComponent } from './components/single-post-dialog/single-post-dialog.component';
import { PostsService } from '../services/posts.service';

@Component({
  selector: '.posts-page',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  public isMobile: boolean = false;
  public isDataAvailable: boolean = false;
  public user: any = null;
  @HostBinding('class') public class: string = '';
<<<<<<< Updated upstream
  public posts: any = null;
=======
  public today: any = null;
>>>>>>> Stashed changes

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public authenticationService: AuthenticationService,
    public testimonyService: TestimonyService,
    public complaintService: ComplaintService,
    public userService: UserService,
    public utilityService: UtilityService,
    public matBottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public postsService: PostsService
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

<<<<<<< Updated upstream
    this.postsService.fetchAllPosts({ limit: 100, page: 1 }).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.posts = reply[0]['data'];
        this.posts.filter((x: any) => {
          switch (x['relation']) {
            case 'complaint':
              x['card'] = x['complaint'][0];
              break;
            case 'testimony':
              x['card'] = x['testimony'][0];
              break;
          }
        });
      },
      complete: () => {
        this.isDataAvailable = true;
        // console.log(this.posts);
      }
=======
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
>>>>>>> Stashed changes
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

  sharePost(post: any) {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: this.user,
        post: post
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

  openSinglePostDialog(post: any) {
    const dialogRef = this.dialog.open<any>(SinglePostDialogComponent, {
      width: '45%',
      data: {
        // post: post['_id']
        post: post,
        user: this.user
      },
      backdropClass: 'card-backdrop',
      // panelClass: 'card-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => { });
  }
}
