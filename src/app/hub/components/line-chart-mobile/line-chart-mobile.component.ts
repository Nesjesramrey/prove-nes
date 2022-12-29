import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { DocumentService } from 'src/app/services/document.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SolutionService } from 'src/app/services/solution.service';
import { TopicService } from 'src/app/services/topic.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, forkJoin,  } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
@Component({
  selector: 'line-chart-mobile',
  templateUrl: './line-chart-mobile.component.html',
  styleUrls: ['./line-chart-mobile.component.scss']
})
export class LineChartMobileComponent  implements OnInit {
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
      // this.userService.fetchFireUser().subscribe({
      //   error: (error) => {
      //     switch (error['status']) {
      //     }},
      //   next: (reply: any) => {
      //     this.user = reply;
      //   },
      //   complete: () => {},
      // });
    } 

  ngOnInit(): void {
    console.log(this.userID)
    this.actionControlActivityList = this.utilityService.actionControlActivityList;
    let document: Observable<any> = this.documentService.fetchDocumentsByCollaborator({ _id: this.userID, });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID, });
    let subcategory: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.subcategoryID, });
    let topic: Observable<any> = this.topicService.fetchSingleTopicById({ _id: '6399ff7f0eddadeae501cfa5' });
    let user: Observable<any> = this.userService.fetchFireUser();

    forkJoin([document, category, subcategory, topic, user,]).subscribe((reply: any) => {
      this.document = reply[0];
      //console.log(this.document)
      this.user = reply[4]
      console.log(this.user)
      this.topic = reply[3]
      //console.log(this.topic)
      this.solutions = this.topic['solutions'];
      //console.log(this.solutions)
     
      
    })
  }
}