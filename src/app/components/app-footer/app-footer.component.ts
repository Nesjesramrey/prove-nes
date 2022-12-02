import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent implements OnInit {
  public isMobile: boolean = false;

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public utilityService: UtilityService,
    public router: Router
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void { }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }
}
