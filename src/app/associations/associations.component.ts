import { Component, OnInit, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserService } from 'src/app/services/user.service';
import { AssociationService } from 'src/app/services/association.service';
import { NavigationEnd, ResolveStart, Router } from '@angular/router';

@Component({
  selector: 'app-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.scss'],
})
export class AssociationsComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public isMobile: boolean = false;
  @Input('user') public user: any = null;
  public semblanza: any = null;
  public associations: any = null;

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public userservices: UserService,
    public associationservices: AssociationService,
    public router: Router,
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void {
    let association: any[] = [];
    this.userservices.fetchFireUser().subscribe({
      error: (error: any) => {
      },
      next: (reply: any) => {
        this.user = reply;
        //console.log(this.user)
        this.user.associations.forEach((element: any) => {
          //console.log(element)
          this.associationservices.fetchAssociationById(element.associationId).subscribe({
            error: (error: any) => {
            },
            next: (reply: any) => {
              association.push(reply);
              this.associations = association;
            },
            complete: () => {
             }
          });   
        });
      },
      complete: () => {
        
        this.isDataAvailable = true
       }
    });
  }
  linkMe(url: string, associationID: string) {
    switch (url) {
      case 'home':     
        this.router.navigateByUrl('/');
        break;    

      case 'profile':
        this.router.navigateByUrl('/asociaciones/' + associationID);
        break;

      
        
    }
  }
}
