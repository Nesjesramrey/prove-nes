import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'solutions-card',
  templateUrl: './solutions-card.component.html',
  styleUrls: ['./solutions-card.component.scss'],
})
export class SolutionsCardComponent implements OnInit {
  @Input() data: any = [];

  constructor() {}

  ngOnInit(): void {
    console.log(this.data);
  }
}
