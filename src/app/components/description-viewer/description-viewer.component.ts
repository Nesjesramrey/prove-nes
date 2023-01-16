import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FavoritesService } from 'src/app/services/favorites.service';
import { AddCommentsSheetComponent } from '../add-comments-sheet/add-comments-sheet.component';
import { ShareSheetComponent } from '../share-sheet/share-sheet.component';

@Component({
  selector: '.description-viewer-dialog',
  templateUrl: './description-viewer.component.html',
  styleUrls: ['./description-viewer.component.scss']
})
export class DescriptionViewerComponent implements OnInit {
  public user: any = null;
  public text: string = '';
  public title: string = '';
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';
  public allFavorites: any[] = [];
  public isFavorite: boolean = false;
  public location: string = '';
  public document: any = null;
  public layout: any = null;

  constructor(
    public dialogRef: MatDialogRef<DescriptionViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public deviceDetectorService: DeviceDetectorService,
    public favoritesService: FavoritesService,
    public matBottomSheet: MatBottomSheet
  ) {
    console.log(this.dialogData);
    this.user = this.dialogData['user'];
    this.document = this.dialogData['document'] || null;
    this.layout = this.dialogData['layout'] || null;
    this.location = this.dialogData['location'];
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    this.text = this.dialogData['text'];
    this.title = this.dialogData['title'];

    switch (this.location) {
      case 'layout':
        this.favoritesService.fetchFavoritesBylayoutID({ _id: this.dialogData['layoutID'] }).subscribe({
          error: (error: any) => { },
          next: (reply: any) => {
            this.allFavorites = reply['data'];
            let favorite: any = this.allFavorites.filter((f: any) => { return f['relationId'] == this.dialogData['layoutID']; });
            // console.log(favorite[0]);
            if (favorite.length == 0) {
              this.isFavorite = false;
            } else {
              this.isFavorite = true;
            }
          }
        });
        break;
    }
  }

  openBottomSheet(): void {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: this.user
      }
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }

  handleFavorites() {
    let favorite: any;
    let data: any = {};

    switch (this.location) {
      case 'layout':
        favorite = this.allFavorites.filter((f: any) => { return f['relationId'] == this.dialogData['layoutID']; });
        if (favorite.length == 0) {
          data = {

          }
        } else { }
        break;
    }

    // console.log(favorite[0]);
  }

  handleComments() {
    const bottomSheetRef = this.matBottomSheet.open(AddCommentsSheetComponent, {
      data: {
        document: this.document,
        layout: this.layout,
        user: this.user,
        location: this.location
      }
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
