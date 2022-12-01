import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: '.public-document-mobile-radar-chart',
  templateUrl: './public-document-mobile-radar-chart.component.html',
  styleUrls: ['./public-document-mobile-radar-chart.component.scss']
})
export class PublicDocumentMobileRadarChartComponent implements OnInit {
  @Input('document') public document: any = null;
  public topics: any[] = [];
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: ''
      },
      legend: {
        display: false
      }
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
        suggestedMax: 100,
        ticks: {
          display: false,
        },
      },
    },
  };
  public radarChartLabels: string[] = [];
  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [
      { data: [], label: '' }
    ]
  };
  public radarChartType: ChartType = 'radar';

  constructor() { }

  ngOnInit(): void {
    this.document['layouts'].filter((x: any) => {
      this.radarChartLabels.push(x['category']['name']);
      this.radarChartData['datasets'][0]['data'].push(x['stats']['score']);
    });
  }

  chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }
}
