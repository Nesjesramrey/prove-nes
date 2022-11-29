import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: '.app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent implements OnInit {
  public isMobile: boolean = false;

  constructor(
    public deviceDetectorService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void { }
}
