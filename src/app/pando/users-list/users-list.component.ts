import { LyDialog } from '@alyle/ui/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AddPermissionsComponent } from 'src/app/components/add-permissions/add-permissions.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '.users-list-page',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  public displayedColumns: string[] = ['select', 'name', 'email', 'activities', 'menu'];
  public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);
  public paginator!: MatPaginator;
  @ViewChild('matPaginator') set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  public users: any = [];
  public isDataAvailable: boolean = false;
  public token: any = null;
  public payload: any = null;
  public user: any = null;

  constructor(
    public authenticationSrvc: AuthenticationService,
    public userSrvc: UserService,
    public dialog: LyDialog,
    public router: Router
  ) {
    this.token = this.authenticationSrvc.fetchToken;
  }

  ngOnInit(): void {
    // token exists
    if (this.token != null) {
      this.payload = JSON.parse(atob(this.token.split('.')[1]));

      let user: Observable<any> = this.userSrvc.fetchUserById({ _id: this.payload['sub'] });
      let users: Observable<any> = this.userSrvc.fetchAllUsers();

      forkJoin([user, users]).subscribe((reply: any) => {
        // console.log(reply);
        this.user = reply[0]['user'];
        this.users = reply[1]['users'];

        if (this.user['activities'].includes('moderator')) {
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.users);
            this.setDataSourceAttributes();
            this.isDataAvailable = true;
          }, 700);
        } else {
          this.router.navigateByUrl('/404');
        }
      });
    }
    //  token null
    else {
      this.router.navigateByUrl('/404');
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  setDataSourceAttributes(): void {
    if (this.isDataAvailable == true) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onAddUserPermissions(userID: string) {
    const dialogRef = this.dialog.open<AddPermissionsComponent>(AddPermissionsComponent, {
      width: 420,
      data: {
        userID: userID
      },
      disableClose: true
    });

    dialogRef.afterClosed.subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}