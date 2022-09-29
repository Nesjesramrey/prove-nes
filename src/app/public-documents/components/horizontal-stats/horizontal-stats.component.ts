import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'horizontal-stats',
  templateUrl: './horizontal-stats.component.html',
  styleUrls: ['./horizontal-stats.component.scss'],
})
export class HorizontalStatsComponent implements OnInit {
  @Input() users: number = 0;
  @Input() interactions: number = 0;

  constructor() { }

  ngOnInit(): void { }
}
