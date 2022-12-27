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
    plugins: {
      title: {
        display: false,
        text: '',
      },
      legend: {
        display: false,
      },
    },
    datasets: {
      radar: {
        borderWidth: 1,
        borderColor: '#54f093',
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#54f093',
        backgroundColor: 'rgba(173, 255, 47, 0.4)',
      },
    },
    scales: {
      r: {
        angleLines: {
          color: '#71F5AD',
        },
        grid: {
          circular: true,
          lineWidth: 2,
          // offset: 10,
          // drawTicks: true,
          // tickWidth: 10,
          // borderWidth: 10,
          // borderDash: [5, 5],
          // drawBorder: true,
           color: '#71F5AD',
          // borderColor: 'red',
        },
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: 50,
        ticks: {
          display: false,
          maxTicksLimit: 6, 
        },
      },
    },
   
  }
    
  // Radar
  public spiderChartLabels:string[] = ["salud", "economia", "ambiente", "politica", "educacion"];
 
  public spiderChartData:any =  [{
    label: 'Food A',
    data: [15, 39, 20, 41, 6],
    //backgroundColor: 'rgba(91, 43, 153, 0.82)',
  
    
},]
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
