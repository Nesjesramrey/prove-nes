import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SocketService } from 'src/app/services/socket.service';
import { SupportService } from 'src/app/services/support.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.support-conversations-page',
  templateUrl: './support-conversations.component.html',
  styleUrls: ['./support-conversations.component.scss']
})
export class SupportConversationsComponent implements OnInit {
  public token: any = null;
  public user: any = null;
  public payload: any = null;
  public conversations: any = [];
  public displayedColumns: string[] = ['select', 'customer', 'email', 'support', 'date', 'menu'];
  public dataSource = new MatTableDataSource<any>();
  public paginator!: MatPaginator;
  @ViewChild('matPaginator') set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  public selection = new SelectionModel<any>(true, []);
  public isDataAvailable: boolean = false;
  public conversation: any = null;

  constructor(
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public supportService: SupportService,
    public utilityService: UtilityService,
    public socketServie: SocketService
  ) {
    this.token = this.authenticationService.fetchToken;
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.payload = JSON.parse(atob(this.token.split('.')[1]));

      let user: Observable<any> = this.userService.fetchUserById({ _id: this.payload['sub'] });
      let conversations: Observable<any> = this.supportService.fetchSupportConversations();

      forkJoin([user, conversations]).subscribe((reply: any) => {
        this.user = reply[0]['user'];
        this.conversations = reply[1]['conversations'];

        setTimeout(() => {
          this.dataSource = new MatTableDataSource(this.conversations);
          this.setDataSourceAttributes();

          this.socketServie.getSupportNotification().subscribe((reply: any) => {
            if (reply['new_conversation'] != undefined) {
              reply['conversation']['isNew'] = true;
              this.conversations.unshift(reply['conversation']);
              this.dataSource = new MatTableDataSource(this.conversations);
              this.setDataSourceAttributes();
            }
          });

          this.socketServie.getSupportConversationMessage().subscribe((reply: any) => {
            console.log(reply);
            let conversation = this.conversations.filter((x: any) => {
              return x['_id'] == reply['conversation']['_id'];
            });
            console.log(conversation);
            this.conversation = conversation;
          });

          this.isDataAvailable = true;
        }, 700);
      });
    }
  }

  setDataSourceAttributes(): void {
    if (this.isDataAvailable == true) {
      this.dataSource.paginator = this.paginator;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAttendMsg(conversatioID: string) {
    this.conversation = this.conversations.filter((x: any) => { return x['_id'] == conversatioID; });
    this.supportService.injectSupportMsg(this.conversation[0]);
  }

  onDeleteMsg(conversationID: string) {
    let data: any = { conversationID: conversationID }

    this.supportService.killSupportConversation(data).subscribe((reply: any) => {
      if (reply['status'] == false) {
        this.utilityService.openErrorSnackBar(reply['error']);
        return;
      }

      this.utilityService.openSuccessSnackBar(reply['message']);
      this.conversations = this.conversations.filter((x: any) => { return x['_id'] != conversationID; });
      this.dataSource = new MatTableDataSource(this.conversations);
      this.setDataSourceAttributes();
    });
  }
}
