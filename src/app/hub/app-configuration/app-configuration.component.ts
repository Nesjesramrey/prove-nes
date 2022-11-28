import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.app-configuration-page',
  templateUrl: './app-configuration.component.html',
  styleUrls: ['./app-configuration.component.scss'],
})
export class AppConfigurationComponent implements OnInit {
  public token: any = null;
  public user: any = null;
  public payload: any = null;
  public isDataAvailable: boolean = false;

  constructor(
    public authenticationService: AuthenticationService,
    public utilityService: UtilityService,
    public userService: UserService
  ) {
    this.token = this.authenticationService.fetchToken;
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.payload = JSON.parse(atob(this.token.split('.')[1]));
      let user: Observable<any> = this.userService.fetchUserById({
        _id: this.payload['sub'],
      });
      forkJoin([user]).subscribe((reply: any) => {
        this.user = reply[0]['user'];
        // console.log(this.user);
        setTimeout(() => {
          this.isDataAvailable = true;
        });
      });
    } else {
      setTimeout(() => {
        this.isDataAvailable = true;
      });
    }
  }
}
