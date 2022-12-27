import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: '.description-viewer-dialog',
  templateUrl: './description-viewer.component.html',
  styleUrls: ['./description-viewer.component.scss']
})
export class DescriptionViewerComponent implements OnInit {
  public text: string = '';
  public title: string = '';
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';
  public isFavorites: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DescriptionViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: { text: string; title: string },
    public deviceDetectorService: DeviceDetectorService,
    public favoritesService: FavoritesService
  ) {
    // console.log(this.dialogData);
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    this.text = this.dialogData.text;
    this.title = this.dialogData.title;
  }

  killDialog() {
    this.dialogRef.close();
  }

  // getUserFavorited() {
  //   return this.allFavorites.filter(
  //     (item: any) => item.createdBy === this.user['_id']
  //   );
  // }

  // addFavorites() {
  //   let favorited = this.getUserFavorited();
  //   if (favorited.length > 0) {
  //     let data = {
  //       _id: favorited[0]._id,
  //       favorites: true,
  //     };
  //     this.favoritesService.updateFavorites(data).subscribe((reply: any) => {
  //       if (reply.message == 'favorite update success') {
  //         this.isFavorites = true;
  //       }
  //     });
  //   } else {
  //     let data = {
  //       solution: this.solutionID,
  //       favorites: true,
  //     };
  //     this.favoritesService.addFavorites(data).subscribe((reply: any) => {
  //       if (reply.message == 'favorites add success') {
  //         this.isFavorites = true;
  //       }
  //       this.allFavorites = [reply.data];
  //     });
  //   }
  // }
}
