import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { VoteDialogComponent } from 'src/app/components/vote-dialog/vote-dialog.component';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { SinglePostDialogComponent } from '../components/single-post-dialog/single-post-dialog.component';

@Component({
  selector: '.single-post-page',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
  public postID: string = '';
  public isDataAvailable: boolean = false;
  public user: any = null;
  public post: any = null;

  constructor(
    public activatedRoute: ActivatedRoute,
    public postsService: PostsService,
    public userService: UserService,
    public utilityService: UtilityService,
    public dialog: MatDialog,
    public matBottomSheet: MatBottomSheet
  ) {
    this.postID = this.activatedRoute['snapshot']['params']['postID'];
    // console.log(this.postID);
  }

  ngOnInit(): void {
    this.userService.fetchFireUser().subscribe({
      error: (error: any) => { },
      next: (reply: any) => { this.user = reply; },
      complete: () => { }
    });

    let data: any = { relationId: this.postID };
    this.postsService.fetchPostByRelationId(data).subscribe({
      error: () => { },
      next: (reply: any) => {
        this.post = reply[0];
        switch (this.post['relation']) {
          case 'complaint':
            this.post['card'] = this.post['complaint'][0];
            break;
          case 'testimony':
            this.post['card'] = this.post['testimony'][0];
            break;
        }
      },
      complete: () => {
        this.isDataAvailable = true;
      }
    });
  }

  sharePost(post: any) {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: this.user,
        // post: post
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
