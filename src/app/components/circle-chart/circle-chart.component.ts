import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';
@Component({
  selector: 'circle-chart',
  templateUrl: './circle-chart.component.html',
  styleUrls: ['./circle-chart.component.scss']
})
export class CircleChartComponent implements OnInit {
  @ViewChild('circleChart', { static: true }) canvas!: ElementRef;
  donutGradient: any[] = [];
  public data: number = 75;
  public circleChartData: ChartData<'doughnut'> = {
    datasets: [
      { data: [this.data, this.data - 100], hoverBackgroundColor: ['rgba(32, 197, 136, 1)', '#E1F2EC'], backgroundColor: ['rgba(32, 197, 136, .75)', '#E1F2EC'] },
    ],
  };
  public circleChartType: 'doughnut' = 'doughnut';

  public circleChartOptions: ChartOptions<'doughnut'> = {
    radius: "100%",
    cutout: "80%",
    circumference: 360,
    responsive: true,
    aspectRatio: 0,
    plugins: {
      tooltip: {
        enabled: false,
      },
      title: {
        display: true,
        align: 'center',
      }
    },
    elements: {
      arc: {
        borderWidth: 0,
        borderRadius: 50,
        backgroundColor: '#E1F2EC',
        borderJoinStyle: 'round',

        // offset: 50,
      }
    }
  }

  // events
  public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }
  constructor() { }
  ngOnInit(): void {
    //     console.log({ canvas: this.canvas })
    //     let ctx = this.canvas.nativeElement.getContext('2d');
    //     ctx.lineCap = "round";
    //     let gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(0.000, 250.000, 500.000, 0.000);
    //     gradient.addColorStop(0.000, 'rgba(32, 197, 136, 1)');
    //     gradient.addColorStop(0.500, 'rgba(48, 110, 255, 1)');
    //     gradient.addColorStop(1, 'rgba(206, 221, 255, 1)');
    //     console.log({ gradient })
    //     this.donutGradient = [{ backgroundColor: [gradient, '#e3e3e3'], borderColor: ['transparent', 'transparent'] }]
  }
}