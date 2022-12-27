import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'footer-mobile',
  templateUrl: './footer-mobile.component.html',
  styleUrls: ['./footer-mobile.component.scss']
})
export class FooterMobileComponent implements OnInit {
  public isMobile: boolean = false;

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public utilityService: UtilityService,
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void {
  }
  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }
}
