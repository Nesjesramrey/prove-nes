import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: '.single-team',
  templateUrl: './single-team.component.html',
  styleUrls: ['./single-team.component.scss']
})
export class SingleTeamComponent implements OnInit {
  public teamID: string = '';
  public team: any = null;
  public isDataAvailable: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public teamService: TeamService
  ) {
    this.teamID = this.activatedRoute['snapshot']['params']['teamID'];
    // console.log(this.teamID);
  }

  ngOnInit(): void {
    let team: Observable<any> = this.teamService.fetchTeamById({ teamID: this.teamID });
    forkJoin([team]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        // console.log(reply);
        this.team = reply[0];
        console.log('team: ', this.team);
      },
      complete: () => { this.isDataAvailable = true; }
    });
  }
}
