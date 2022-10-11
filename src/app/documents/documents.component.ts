import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: '.documents-page',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public user: any = null;
  public userActivities: any = [];

  constructor(
    public userService: UserService,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    let user: Observable<any> = this.userService.fetchFireUser();

    forkJoin([user]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        // console.log(reply);
        this.user = reply[0];
        this.user['activities'].filter((x: any) => { this.userActivities.push(x['value']); });

        if (this.userActivities.length != 0) { }
      },
      complete: () => {
        this.isDataAvailable = true;
      }
    });
  }
}
