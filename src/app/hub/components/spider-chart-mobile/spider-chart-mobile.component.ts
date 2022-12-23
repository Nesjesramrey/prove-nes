import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';


@Component({
  selector: 'spider-chart-mobile',
  templateUrl: './spider-chart-mobile.component.html',
  styleUrls: ['./spider-chart-mobile.component.scss'],
})
export class SpiderChartMobileComponent implements OnInit {
  public spiderChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r: {
        grid: {
          circular: true,
          // offset: 10,
          // drawTicks: true,
          // tickWidth: 10,
          // borderWidth: 10,
          // borderDash: [5, 5],
          // drawBorder: true,
          color: '#fff',
          // borderColor: 'red',
        },
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          display: false,
          color: 'green'
        },
      },
    },
   }
  // Radar
  public spiderChartLabels:string[] = ['Designer', 'Developer', 'Tester', 'Clients', 'HR'];
 
  public spiderChartData:any = [
    {data: [20, 40, 15, 30, 12], label: 'Company A'},
  
  ];
  public spiderChartType: ChartType = 'radar';

 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  
  }

  constructor() {}

  ngOnInit(): void {}
}
