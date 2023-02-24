import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ComplaintDialogComponent } from 'src/app/components/complaint-dialog/complaint-dialog.component';
import { TestimonyDialogComponent } from 'src/app/components/testimony-dialog/testimony-dialog.component';
import { SearchPostsDialogComponent } from '../search-posts-dialog/search-posts-dialog.component';

@Component({
  selector: '.posts-sheet-menu',
  templateUrl: './posts-sheet-menu.component.html',
  styleUrls: ['./posts-sheet-menu.component.scss']
})
export class PostsSheetMenuComponent implements OnInit {
  public user: any = null;
  public isMobile: boolean = false;

  constructor(
    public bottomSheetRef: MatBottomSheetRef<PostsSheetMenuComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: any,
    public dialog: MatDialog,
    public deviceDetectorService: DeviceDetectorService
  ) {
    this.user = this.sheetData['user'];
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void { }

  popComplaintsDialog() {
    let panelClass: string = '';
    switch (this.isMobile) {
      case true:
        panelClass = 'full-dialog';
        break;
      case false:
        panelClass = 'side-dialog';
        break;
    }
    const dialogRef = this.dialog.open<any>(ComplaintDialogComponent, {
      width: '100%',
      data: { user: this.user },
      disableClose: true,
      panelClass: panelClass
    });
    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
    this.bottomSheetRef.dismiss();
  }

  popTestimonialsDialog() {
    let panelClass: string = '';
    switch (this.isMobile) {
      case true:
        panelClass = 'full-dialog';
        break;
      case false:
        panelClass = 'side-dialog';
        break;
    }
    const dialogRef = this.dialog.open<any>(TestimonyDialogComponent, {
      width: '100%',
      data: { user: this.user },
      disableClose: true,
      panelClass: panelClass
    });
    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
    this.bottomSheetRef.dismiss();
  }

  popSearchPosts() {
    const dialogRef = this.dialog.open<any>(SearchPostsDialogComponent, {
      width: '420px',
      data: { user: this.user },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
    this.bottomSheetRef.dismiss();
  }
}
