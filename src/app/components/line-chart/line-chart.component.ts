import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: '.line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  public salesData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'Mobiles', data: [1000, 1200, 1050, 2000, 500], tension: 0.5 }
    ],
  };
  public chartOptions: ChartOptions = {
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { display: false }
      },
      y: {
        ticks: { display: false }
      }
    },
  };

  constructor() { }

  ngOnInit(): void { }
}
