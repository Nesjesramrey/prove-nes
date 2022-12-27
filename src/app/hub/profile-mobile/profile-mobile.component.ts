import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'profile-mobile',
  templateUrl: './profile-mobile.component.html',
  styleUrls: ['./profile-mobile.component.scss'],
})
export class ProfileMobileComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public user: any = null;

  constructor() {}

  ngOnInit(): void {}
}
