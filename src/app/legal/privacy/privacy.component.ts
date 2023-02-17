import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: '.privacy-page',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  public isMobile: boolean = false;
  public isDataAvailable: boolean = false;

  constructor(
    public deviceDetectorService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }
}
