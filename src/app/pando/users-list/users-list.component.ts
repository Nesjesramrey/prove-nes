import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AddPermissionsComponent } from 'src/app/components/add-permissions/add-permissions.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { UserDetailsDialogComponent } from '../user-details-dialog/user-details-dialog.component';
import * as XLSX from 'xlsx';

@Component({
  selector: '.users-list-page',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  public displayedColumns: string[] = ['select', 'avatarImage', 'name', 'email', 'phone', 'activities', 'createtAt', 'menu'];
  public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);
  public paginator!: MatPaginator;
  @ViewChild('matPaginator') set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  public users: any = [];
  public isDataAvailable: boolean = false;
  public user: any = null;
  public userActivities: any = [];
  public limitPerPage: number = 40;
  public page: number = 1;
  public pageIndex: number = 0;

  constructor(
    public authenticationSrvc: AuthenticationService,
    public userSrvc: UserService,
    public dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit(): void {
    let user: Observable<any> = this.userSrvc.fetchFireUser();
    let users: Observable<any> = this.userSrvc.fetchAllUsers({ limitPerPage: this.limitPerPage, page: this.page });
    forkJoin([user, users]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.user = reply[0];
        this.user['activities'].filter((x: any) => { this.userActivities.push(x['value']); });

        this.users = reply[1];
        this.dataSource = new MatTableDataSource(this.users);
        // console.log('users: ', this.users);
      },
      complete: () => {
        this.isDataAvailable = true;
        // this.setDataSourceAttributes();
      }
    });
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
    let user: any = this.users.filter((x: any) => { return x['_id'] == userID; });
    const dialog = this.dialog.open(AddPermissionsComponent, {
      width: '420px',
      data: {
        userID: userID,
        user: user
      }
    });

    dialog.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        let user: any = this.users.filter((x: any) => {
          return x['_id'] == reply['user']['_id'];
        });
        user[0]['activities'] = reply['user']['activities'];
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  popUserData(user: any) {
    const dialog = this.dialog.open(UserDetailsDialogComponent, {
      data: { user: user['_id'] },
      panelClass: 'posts-dialog'
    });

    dialog.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  exportExcel() {
    let table: any[] = [];
    this.selection['selected'].filter((x: any) => {
      let obj: any = {
        name: x['firstname'] + ' ' + x['lastname'],
        email: x['email'],
        phone: x['phone']
      }
      table.push(obj);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(table)
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'user-list.xlsx');
  }

  handlePageEvent(event: any) {
    if (event.pageIndex > this.pageIndex) {
      this.loadNextUserBatch();
    } else { }
  }

  loadNextUserBatch() {
    this.page = this.page + 1;
    this.userSrvc.fetchAllUsers({ limitPerPage: this.limitPerPage, page: this.page }).subscribe({
      error: () => { },
      next: (reply: any) => {
        reply.filter((x: any) => { this.dataSource.data.push(x); });
      },
      complete: () => {
        // this.dataSource = new MatTableDataSource(this.users);
      }
    });
  }
}
