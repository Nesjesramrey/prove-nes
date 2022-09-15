import { Component, Input, OnInit } from '@angular/core';
import {
  ChartConfiguration,
  ChartData,
  ChartEvent,
  ChartType,
  Scale,
  ScaleChartOptions,
} from 'chart.js';

@Component({
  selector: 'spider-chart',
  templateUrl: './spider-chart.component.html',
  styleUrls: ['./spider-chart.component.scss'],
})
export class SpiderChartComponent implements OnInit {
  public spiderChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    font: {
      style: 'normal',
      weight: 'bold',
    },
    datasets: {
      radar: {
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 1,
        fill: true,
        pointRadius: 0,
        backgroundColor: 'rgba(255, 109, 0, 0.4) ',
      },
    },
    scales: {
      r: {
        grid: {
          circular: true,
          // offset: 10,
          // drawTicks: false,
          // tickWidth: 10,
          borderWidth: 10,
          // borderDash: [5, 5],
          drawBorder: false,
          // color: '#fff',
          borderColor: 'red',
        },
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          display: false,
        },
      },
    },
  };

  @Input() withBorder: boolean = true;

  public spiderData: ChartData<'radar'> = {
    labels: ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
    datasets: [{ data: [96, 65, 81, 76, 33, 81, 38, 79] }],
  };
  public spiderChartType: ChartType = 'radar';

  constructor() {}

  ngOnInit(): void {}
}