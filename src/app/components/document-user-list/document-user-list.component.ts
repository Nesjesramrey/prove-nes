import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { WindowAlertComponent } from '../window-alert/window-alert.component';

@Component({
  selector: '.document-user-list',
  templateUrl: './document-user-list.component.html',
  styleUrls: ['./document-user-list.component.scss']
})
export class DocumentUserListComponent implements OnInit {
  public displayedColumns: string[] = ['select', 'name', 'email', 'activities', 'menu'];
  public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);
  public paginator!: MatPaginator;
  @ViewChild('matPaginator') set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  public isDataAvailable: boolean = false;
  public users: any = [];
  public location: any = null;

  constructor(
    public dialogRef: MatDialogRef<DocumentUserListComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialog: MatDialog,
    public userService: UserService
  ) {
    // console.log(this.dialogData);
    this.users = this.dialogData['users'];
    // console.log('users: ', this.users);
    this.location = this.dialogData['location'];
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.users);
      this.setDataSourceAttributes();
      this.isDataAvailable = true;
    }, 300);
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

  configUser(user: any) {
    let data: any = { _id: user['_id'] };
    this.userService.fetchUserById(data).subscribe({
      error: () => { },
      next: (reply: any) => {
        console.log(reply);
      }
    });
  }

  KillUser(user: any) {
    const dialogRef = this.dialog.open<WindowAlertComponent>(WindowAlertComponent, {
      width: '420px',
      data: {
        windowType: 'kill-collaborator',
        user: user
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
