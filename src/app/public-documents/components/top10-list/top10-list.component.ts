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
  @Input() data: any[] = [];
  isColor: boolean = false;

  constructor() { }

  ngOnInit(): void { 
    // console.log(this.data);
  }
}
