import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocketService } from 'src/app/services/socket.service';
import { SupportService } from 'src/app/services/support.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {
  public expanded: boolean = false;
  public isVisible: boolean = false;
  @Input('user') public user: any = null;
  public msgFormGroup!: FormGroup;
  public conversation: any = [];

  constructor(
    public formBuilder: FormBuilder,
    public supportService: SupportService,
    public utilityService: UtilityService,
    public socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.msgFormGroup = this.formBuilder.group({
      message: ['', [Validators.required]]
    });

    setTimeout(() => {
      // console.log(this.user);
    });
  }

  expandBox() {
    this.expanded = !this.expanded;
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
    this.expanded = false;
  }

  onSendMessage() {
    let data: any = {
      customer: this.user['_id'],
      messages: [{
        text: this.msgFormGroup.value.message,
        user: this.user['_id']
      }]
    }
    this.supportService.sendSupportMessage(data).subscribe((reply: any) => {
      console.log(reply);
      if (reply['status'] == false) {
        this.utilityService.openErrorSnackBar(reply['error']);
        return;
      }
      this.conversation = reply['conversation'];
      this.socketService.putSupportNotification({ new_conversation: true, conversation: reply['conversation'] });
      // console.log(this.conversation);
      // this.utilityService.openSuccessSnackBar(reply['message']);
    });
  }
}
