import { Component, OnInit } from '@angular/core';

@Component({
  selector: '.horizontal-stats',
  templateUrl: './horizontal-stats.component.html',
  styleUrls: ['./horizontal-stats.component.scss'],
})
export class HorizontalStatsComponent implements OnInit {
  public usersTotal: number = 1000;
  public interactionsTotal: number = 3200;
  constructor() {}

  ngOnInit(): void {}
}
