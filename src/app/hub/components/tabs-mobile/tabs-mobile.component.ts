import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserService } from 'src/app/services/user.service';
import { DocumentService } from 'src/app/services/document.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SolutionService } from 'src/app/services/solution.service';
import { TopicService } from 'src/app/services/topic.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, forkJoin, } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
@Component({
  selector: 'tabs-mobile',
  templateUrl: './tabs-mobile.component.html',
  styleUrls: ['./tabs-mobile.component.scss'],
})
export class TabsMobileComponent implements OnInit {
  public userID: string = '';
  public documentID: string = '';
  public accessToken: any = null;
  public categoryID: string = '';
  public subcategoryID: string = '';
  public themeID: string = '';
  public carouselContentSize: number = 150;
  public selectedCategory: any = null;
  public user: any = null;
  public document: any = null;
  public documents: any = null;
  public category: any = null;
  public subcategory: any = null;
  public topics: any = null;
  public topic: any = null;
  public layout: any = [];
  public isDataAvailable: boolean = false;
  public layouts: any[] = [];
  public imagesToUpload: string[] = [];
  public states: any = [];
  public displayedColumns: string[] = ['title', 'ranking', 'users', 'interactions', 'menu'];
  public dataSource = new MatTableDataSource<any>();
  public collaborators: any = null;
  public solutions: any[] = [];
  public actionControlActivityList: any[] = [];
  public accesibleLayouts: any[] = [];
  public userCoverageObj: any[] = [];
  public userCoverageStr: any[] = [];
  public topicCoverage: any = null;
  public isMobile: boolean = false;



  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public documentService: DocumentService,
    public layoutService: LayoutService,
    public solutionService: SolutionService,
    public topicService: TopicService,
    public utilityService: UtilityService,
    public deviceDetectorService: DeviceDetectorService,
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.userID = this.activatedRoute['snapshot']['params']['userID'];

  }

  ngOnInit(): void {
    this.isDataAvailable = true
 
   
  }
}
