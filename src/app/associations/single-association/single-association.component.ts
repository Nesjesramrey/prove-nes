import { Component, OnInit, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LyDialog } from '@alyle/ui/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AssociationService } from 'src/app/services/association.service';
import { SheetFeedComponent } from 'src/app/components/sheet-feed/sheet-feed.component';
import { ModalMembersComponent } from 'src/app/hub/components/modal-members/modal-members.component';
import { SetAvatarAssociationComponent } from 'src/app/components/set-avatar-association/set-avatar-association.component';


@Component({
  selector: 'single-association',
  templateUrl: './single-association.component.html',
  styleUrls: ['./single-association.component.scss']
})
export class SingleAssociationComponent implements OnInit {

  public isDataAvailable: boolean = false;
  public isMobile: boolean = false;
  @Input('user') public user: any = null;
  public associationID: any = null;
  public semblanza: any = null;
  public association: any = null;

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public userservices: UserService,
    public associationservices: AssociationService,
    public matBottomSheet: MatBottomSheet,
    public dialogData: MatDialog,
    public dialog: LyDialog,
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
        console.log(this.association)
      },
      complete: () => {
        
       }
    });   

    this.userservices.fetchFireUser().subscribe({
      error: (error: any) => {
      },
      next: (reply: any) => {
        this.user = reply;        
      },
      complete: () => {
        setTimeout(() =>{
          this.isDataAvailable = true
        },500)
        
       }
    });
}
openModalMembers() {
  this.dialogData.open(ModalMembersComponent, {
    data: {},
    height: '100%',
    width: '100%',
    panelClass: 'full-dialog',
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

openCropperDialog(event: Event) {
  const dialogRef = this.dialog.open<SetAvatarAssociationComponent, Event>(
    SetAvatarAssociationComponent,
    {
      width: 300,
      data: event,
      disableClose: true,
    }
  );
  dialogRef.afterClosed.subscribe((reply: any) => {
    if (reply != undefined) {
      //window.location.reload();
    }
  });
}

}