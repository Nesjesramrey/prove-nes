import { Component, OnInit, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AssociationService } from 'src/app/services/association.service';
import { SheetFeedComponent } from 'src/app/components/sheet-feed/sheet-feed.component';

@Component({
  selector: 'single-association',
  templateUrl: './single-association.component.html',
  styleUrls: ['./single-association.component.scss']
})
export class SingleAssociationComponent implements OnInit {

  public isDataAvailable: boolean = false;
  public isMobile: boolean = false;
  @Input('user') public user: any = null;
  public associationID: string = '';
  public semblanza: any = null;
  public association: any = null;

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public userservices: UserService,
    public associationservices: AssociationService,
    public matBottomSheet: MatBottomSheet,
    public activatedRoute: ActivatedRoute,
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.associationID = this.activatedRoute['snapshot']['params']['associationID'];
   }

  

  ngOnInit(): void {

    this.associationservices.fetchAssociationById(this.associationID).subscribe({
      error: (error: any) => {
      },
      next: (reply: any) => {
        this.association = reply;
        //console.log(this.association)
      },
      complete: () => {
        this.isDataAvailable = true
       }
    });   

    this.userservices.fetchFireUser().subscribe({
      error: (error: any) => {
      },
      next: (reply: any) => {
        this.user = reply;        
      },
      complete: () => {
        
        this.isDataAvailable = true
       }
    });
}
openBottomSheet(): void {
  const bottomSheetRef = this.matBottomSheet.open(SheetFeedComponent, {
    data: {
      user: this.user
    }
  });

  bottomSheetRef.afterDismissed().subscribe((reply: any) => {
    if (reply != undefined) { }
  });
}


}