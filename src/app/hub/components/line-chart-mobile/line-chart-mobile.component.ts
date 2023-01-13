import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { DocumentService } from 'src/app/services/document.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SolutionService } from 'src/app/services/solution.service';
import { TopicService } from 'src/app/services/topic.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, forkJoin, } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
@Component({
  selector: 'line-chart-mobile',
  templateUrl: './line-chart-mobile.component.html',
  styleUrls: ['./line-chart-mobile.component.scss']
})
export class LineChartMobileComponent implements OnInit {
  public userID: string = '';
  public progressValue: any ="";




  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public documentService: DocumentService,
    public layoutService: LayoutService,
    public solutionService: SolutionService,
    public topicService: TopicService,
    public utilityService: UtilityService,

  ) {
    this.userID = this.activatedRoute['snapshot']['params']['userID'];

  }

  ngOnInit(): void {
    //console.log(this.userID)
    this.progressValue = 90;


   
  }
}