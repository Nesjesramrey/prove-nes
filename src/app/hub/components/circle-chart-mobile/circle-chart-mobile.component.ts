import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'circle-chart-mobile',
  templateUrl: './circle-chart-mobile.component.html',
  styleUrls: ['./circle-chart-mobile.component.scss']
})
export class CircleChartMobileComponent implements OnInit {
  progressValue: number = 75;


  constructor() { }

  ngOnInit(): void {
  }

}
