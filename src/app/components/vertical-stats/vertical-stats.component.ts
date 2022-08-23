import { Component, OnInit } from '@angular/core';

@Component({
  selector: '.vertical-stats',
  templateUrl: './vertical-stats.component.html',
  styleUrls: ['./vertical-stats.component.scss'],
})
export class VerticalStatsComponent implements OnInit {
  public solutionsTotal: number = 2000;
  public problemsTotal: number = 1200;

  constructor() {}

  ngOnInit(): void {}
}
