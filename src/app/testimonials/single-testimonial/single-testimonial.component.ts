import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TestimonyService } from 'src/app/services/testimony.service';
import { UtilityService } from 'src/app/services/utility.service';
import { UserService } from 'src/app/services/user.service';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { VoteDialogComponent } from 'src/app/components/vote-dialog/vote-dialog.component';

@Component({
  selector: 'single-testimonial',
  templateUrl: './single-testimonial.component.html',
  styleUrls: ['./single-testimonial.component.scss']
})
export class SingleTestimonialComponent implements OnInit {
  public testimonyID: string = '';
  public isMobile: boolean = false;
  public isDataAvailable: boolean = false;
  public testimony: any = null;
  public user: any = null;
  public card: any[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public deviceDetectorService: DeviceDetectorService,
    public testimonyService: TestimonyService,
    public utilityService: UtilityService,
    public userService: UserService,
    public matBottomSheet: MatBottomSheet,
    public dialog: MatDialog
  ) {
    this.testimonyID = this.activatedRoute['snapshot']['params']['testimonyID'];
    this.isMobile = this.deviceDetectorService.isMobile();
   }

  ngOnInit(): void {
    this.userService.fetchFireUser().subscribe({
      error: (error: any) => { },
      next: (reply: any) => { this.user = reply; },
      complete: () => { }
    });
    let testimony: Observable<any> = this.testimonyService.fetchSingleTestimonyById({ testimonyID: this.testimonyID });
    forkJoin([testimony]).subscribe((reply: any) => {
       //console.log(reply);
      this.testimony = reply[0];
      //console.log(this.testimony);
      this.card = [this.testimony];
      //console.log(this.card)
      this.card.filter((x: any) => { x['comments'] = []; });
      let avatarImage: any = null;
      this.card.filter((x: any) => {
        let data: any = { _id: x.createdBy._id };
        this.userService.fetchUserById(data).subscribe({
          error: (error: any) => {},
          next: (reply: any) => {
            avatarImage = reply.avatarImage;
            //console.log(avatarImage);
            x['avatarImage'] = avatarImage;
          },
          complete: () => {},
        });
        
      });
      // console.log(this.card);

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
