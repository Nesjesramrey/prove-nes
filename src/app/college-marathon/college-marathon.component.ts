import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { UtilityService } from '../services/utility.service';
import { MarathonInfoDialogComponent } from './marathon-info-dialog/marathon-info-dialog.component';

@Component({
  selector: '.college-marathon',
  templateUrl: './college-marathon.component.html',
  styleUrls: ['./college-marathon.component.scss']
})
export class CollegeMarathonComponent implements OnInit {
  public isMobile: boolean = false;
  public user: any = null;
  public userAvailable: boolean = false;
  public isDataAvailable: boolean = false;
  @HostBinding('class') public class: string = '';

  constructor(
    public utilityService: UtilityService,
    public deviceDetectorService: DeviceDetectorService,
    public userService: UserService,
    public dialog: MatDialog
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    let user: Observable<any> = this.userService.fetchFireUser();
    forkJoin([user]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.user = reply[0];
        // console.log('user: ', this.user);
        if (this.user['status'] != undefined) {
          this.userAvailable = true;
        }
      },
      complete: () => { this.isDataAvailable = true; }
    });
  }

  popMarathonInfoDialog() {
    const dialogRef = this.dialog.open<MarathonInfoDialogComponent>(
      MarathonInfoDialogComponent, {
      width: '640px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popAnnouncement() {
    window.open('https://static-assets-pando.s3.amazonaws.com/assets/convocatoria-maraton.docx');
  }
}
