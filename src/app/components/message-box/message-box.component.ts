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
  public conversation: any = null;

  constructor(
    public formBuilder: FormBuilder,
    public supportService: SupportService,
    public utilityService: UtilityService,
    public socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.supportService.getSupportMsg().subscribe((reply: any) => {
      this.conversation = reply;
    });

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
    let data: any;

    // saved conversation
    if (this.conversation != null) {
      data = {
        conversationID: this.conversation['_id'],
        sender: this.user['_id'],
        message: {
          text: this.msgFormGroup.value.message,
          user: this.user['_id']
        }
      }

      this.supportService.injectConversationMessage(data).subscribe((reply: any) => {
        if (reply['status'] == false) {
          this.utilityService.openErrorSnackBar(reply['error']);
          return;
        }

        this.conversation['messages'] = reply['conversation']['messages'];
        this.socketService.putSupportConversationMessage({ conversation: reply['conversation'] });
        this.msgFormGroup.patchValue({ message: '' });
      });
    }

    // new conversation
    else {
      data = {
        customer: this.user['_id'],
        messages: [{
          text: this.msgFormGroup.value.message,
          user: this.user['_id']
        }]
      }

      this.supportService.sendSupportMessage(data).subscribe((reply: any) => {
        if (reply['status'] == false) {
          this.utilityService.openErrorSnackBar(reply['error']);
          return;
        }

        this.conversation = reply['conversation'];
        this.socketService.putSupportNotification({ new_conversation: true, conversation: reply['conversation'] });
        this.msgFormGroup.patchValue({ message: '' });
      });
    }
  }
}
