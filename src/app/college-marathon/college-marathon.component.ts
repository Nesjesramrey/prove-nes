import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { UtilityService } from '../services/utility.service';

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

  constructor(
    public utilityService: UtilityService,
    public deviceDetectorService: DeviceDetectorService,
    public userService: UserService
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
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
}
