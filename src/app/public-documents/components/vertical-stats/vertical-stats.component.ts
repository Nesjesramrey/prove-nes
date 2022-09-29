import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vertical-stats',
  templateUrl: './vertical-stats.component.html',
  styleUrls: ['./vertical-stats.component.scss'],
})
export class VerticalStatsComponent implements OnInit {
  @Input() topics: number = 0;
  @Input() solutions: number = 0;

  constructor() { }

  ngOnInit(): void { }
}
