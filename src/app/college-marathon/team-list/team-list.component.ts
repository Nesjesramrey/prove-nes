import { Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { forkJoin, Observable } from 'rxjs';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public user: any = null;
  public teams: any = null;
  public searchTeamsFG!: FormGroup;
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';

  constructor(
    public userService: UserService,
    public teamService: TeamService,
    public utilityService: UtilityService,
    public formBuilder: FormBuilder,
    public deviceDetectorService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    let user: Observable<any> = this.userService.fetchFireUser();
    let teams: Observable<any> = this.teamService.fetchAllTeams();
    forkJoin([user, teams]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        // console.log(reply);
        this.user = reply[0];
        // console.log('user: ', this.user);

        this.teams = reply[1];
        this.teams.filter((x: any) => { x['teamScore'] = this.setTeamScore(x); });
        // console.log('teams: ', this.teams);
      },
      complete: () => {
        this.searchTeamsFG = this.formBuilder.group({
          filter: ['', [Validators.required]]
        });
        this.isDataAvailable = true;
      }
    });
  }

  serachTeams(form: FormGroup) {
    let data: any = { filter: form['value']['filter'] };
    this.teamService.searchTeamsModule(data).subscribe({
      error: () => { },
      next: (reply: any) => {
        console.log(reply);
        this.teams = null;
        this.teams = reply['data'];
        this.teams.filter((x: any) => { x['teamScore'] = this.setTeamScore(x); });
      },
      complete: () => { }
    });
  }

  setTeamScore(data: any) {
    let points: any = [];
    for (var key of Object.keys(data['metadata']['score'])) {
      points.push(data['metadata']['score'][key]['point']);
    }
    let teamScore = points.reduce((a: any, b: any) => a + b, 0);
    return teamScore;
  }
}
