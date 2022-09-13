import { Component, Input, OnInit } from '@angular/core';

export interface Section {
  name: string;
  value: number;
}

@Component({
  selector: 'top10-list',
  templateUrl: './top10-list.component.html',
  styleUrls: ['./top10-list.component.scss'],
})
export class Top10ListComponent implements OnInit {
  @Input() data: Section[] = [];
  @Input() color: any;

  isColor: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.checkColor(this.color);
    console.log({ color: this.color });
  }
  checkColor(color: any) {
    if (color && color.bg === '#FF6D00') {
      this.isColor = true;
    }
  }
}
