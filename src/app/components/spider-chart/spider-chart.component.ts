import { ViewChild, Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'spider-chart',
  templateUrl: './spider-chart.component.html',
  styleUrls: ['./spider-chart.component.scss'],
})
export class SpiderChartComponent implements OnInit {
  @ViewChild('canvas') canvas: any;
  public mychart: any;
  public suggestedMax: any = null;
  public spiderChartOptions: ChartConfiguration['options'] = {};
  @Input() withBorder: boolean = true;
  @Input() data: any[] = [];
  public spiderData: ChartData<'radar'> = {
    labels: [],
    datasets: [{ data: [] }],
  };
  public spiderChartType: ChartType = 'radar';

  constructor() { }

  ngOnInit(): void {
    this.loadChart();
  }

  ngAfterContentInit() {
    // var ctx = <HTMLCanvasElement>document.querySelector('#canvas');
    // var context = ctx.getContext('2d')!;
    // var gradientColor = context.createLinearGradient(0, 0, 0, 200);
    // gradientColor.addColorStop(0, 'green');
    // gradientColor.addColorStop(1, 'red');
    // gradientColor.addColorStop(1, 'pink');
    // gradientColor.addColorStop(1, 'orange');
    // return gradientColor;
  }

  loadChart() {
    if (this.data.length === 0) {
      this.spiderData = {
        labels: [],
        datasets: [{ data: [] }],
      };
      return;
    }
    const labels: any = [];
    const datasets: any = [];

    this.data.map((item) => {
      labels.push(item.category.name);
      datasets.push(item.stats.score);
    });

    this.spiderData = {
      labels,
      datasets: [{ data: datasets }],
    };
    // console.log(this.spiderData['datasets'][0]['data']);
    let arr: any = this.spiderData['datasets'][0]['data']
    this.suggestedMax = Math.max.apply(null, arr);
    this.spiderChartOptions = {
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
          grid: {
            circular: true,
            // offset: 10,
            // drawTicks: true,
            // tickWidth: 10,
            // borderWidth: 10,
            // borderDash: [5, 5],
            // drawBorder: true,
            // color: '#fff',
            // borderColor: 'red',
          },
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: this.suggestedMax,
          ticks: {
            display: false,
          },
        },
      },
    }
  }
}
