import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: '.pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  public salesData: ChartData<'doughnut'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'Mobiles', data: [1200, 200] }
    ],
  };
  public chartOptions: ChartOptions<'doughnut'> = {
    cutout: 70,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        display: false,
        ticks: { display: false }
      },
      y: {
        display: false,
        ticks: { display: false }
      }
    }
  };

  constructor() { }

  ngOnInit(): void { }
}
