import { Component, Input, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';

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

  constructor() { }

  ngOnInit(): void {
    console.log({ data: this.data });
  }
}
