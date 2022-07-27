import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '.message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {
  public expanded: boolean = false;
  public isVisible: boolean = false;
  @Input('user') public user: any = null;

  constructor() { }

  ngOnInit(): void {
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
}
