import { Component, Input, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';

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

  constructor(
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }
}
