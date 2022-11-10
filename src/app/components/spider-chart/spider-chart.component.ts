import {
  ViewChild,
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ElementRef,
} from '@angular/core';
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
  @ViewChild('canvas') canvas: any;
  mychart: any;
  ngAfterContentInit() {
    var ctx = <HTMLCanvasElement>document.querySelector('#canvas');

    var context = ctx.getContext('2d')!;
    var gradientColor = context.createLinearGradient(0, 0, 0, 200);

    gradientColor.addColorStop(0, 'green');
    gradientColor.addColorStop(1, 'red');
    gradientColor.addColorStop(1, 'pink');
    gradientColor.addColorStop(1, 'orange');

    // this.canvas = [
    //   {
    //     backgroundColor: gradientColor,
    //     borderColor: 'black',
    //   },
    // ];
    return gradientColor;
  }

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
        backgroundColor: '#71F5AD',
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
  @Input() data: any[] = [];

  public spiderData: ChartData<'radar'> = {
    labels: ['data', 'data', 'data', 'data', 'data', 'data', 'data', 'data'],
    datasets: [{ data: [96, 65, 81, 76, 33, 81, 38, 79] }],
  };
  public spiderChartType: ChartType = 'radar';

  constructor() {}

  ngOnInit(): void {
    this.loadChart();
  }

  loadChart() {
    if (this.data.length === 0) {
      this.spiderData = {
        labels: ['data', 'data', 'data', 'data'],
        datasets: [{ data: [96, 65, 81, 26] }],
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
  }
}
