import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocketService } from 'src/app/services/socket.service';
import { SupportService } from 'src/app/services/support.service';
import { UtilityService } from 'src/app/services/utility.service';

export interface ICategoryFormat {
  name: string;
  pos: {
    x: number;
    y: number;
  };
  size: number;
  opacity: number;
}


@Component({
  selector: 'panel-subcategory',
  templateUrl: './panel-subcategory.component.html',
  styleUrls: ['./panel-subcategory.component.scss'],
})
export class PanelSubcategoryComponent implements OnInit {
  public expanded: boolean = false;
  public isVisible: boolean = false;
  @Input('user') public user: any = null;
  public msgFormGroup!: FormGroup;
  public conversation: any = null;
  @Input() data: any[] = [];
  public categories: ICategoryFormat[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public supportService: SupportService,
    public utilityService: UtilityService,
    public socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.supportService.getSupportMsg().subscribe((reply: any) => {
      this.conversation = reply;
    });

    this.msgFormGroup = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    setTimeout(() => {
      // console.log(this.user);
    });
    this.loadCategories();
  }

  loadCategories() {
    const sizes = [15, 25, 34];
    const opacities = [0.5, 1];
    let maxX = 600;
    let maxY = 700;
    this.categories = this.data.map((item) => {
      item.size = sizes[(Math.random() * sizes.length) | 0];
      item.opacity = opacities[(Math.random() * opacities.length) | 0];

      if (item.name.length > 12) {
        maxX = 400;
      } else {
        maxX = 600;
      }

      item.pos = {
        x: Math.floor(Math.random() * (maxX + 1) + 0),
        y: Math.floor(Math.random() * (maxY + 1) + 0),
      };
      return item;
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
          user: this.user['_id'],
        },
      };

      this.supportService
        .injectConversationMessage(data)
        .subscribe((reply: any) => {
          if (reply['status'] == false) {
            this.utilityService.openErrorSnackBar(reply['error']);
            return;
          }

          this.conversation['messages'] = reply['conversation']['messages'];
          this.socketService.putSupportConversationMessage({
            conversation: reply['conversation'],
          });
          this.msgFormGroup.patchValue({ message: '' });
        });
    }

    // new conversation
    else {
      data = {
        customer: this.user['_id'],
        messages: [
          {
            text: this.msgFormGroup.value.message,
            user: this.user['_id'],
          },
        ],
      };

      this.supportService.sendSupportMessage(data).subscribe((reply: any) => {
        if (reply['status'] == false) {
          this.utilityService.openErrorSnackBar(reply['error']);
          return;
        }

        this.conversation = reply['conversation'];
        this.socketService.putSupportNotification({
          new_conversation: true,
          conversation: reply['conversation'],
        });
        this.msgFormGroup.patchValue({ message: '' });
      });
    }
  }
}
