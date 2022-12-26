import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: '.public-document-mobile-radar-chart',
  templateUrl: './public-document-mobile-radar-chart.component.html',
  styleUrls: ['./public-document-mobile-radar-chart.component.scss']
})
export class PublicDocumentMobileRadarChartComponent implements OnInit {
  @Input('document') public document: any = null;
  @Input('layout') public layout: any = null;
  @Input('isLayout') public isLayout: boolean = false;
  @Input('isSubLayout') public isSubLayout: boolean = false;
  @Input('topics') public topics: any[] = [];
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
          circular: true
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
    if (this.document != null) {
      this.document['layouts'].filter((x: any) => {
        this.radarChartLabels.push(x['category']['name']);
        if (x['stats'] == null) { x['stats'] = { score: 0 } };
        this.radarChartData['datasets'][0]['data'].push(x['stats']['score']);
      });
    }

    if (this.isLayout) {
      this.layout['subLayouts'].filter((x: any) => {
        this.radarChartLabels.push(x['category']['name']);
        this.radarChartData['datasets'][0]['data'].push(x['stats']['score']);
      });
    }

    if (this.isSubLayout) {
      if (this.topics.length != 0) {
        this.topics.filter((x: any) => {
          this.radarChartLabels.push(x['title']);
          this.radarChartData['datasets'][0]['data'].push(x['stats']['score']);
        });
      }
    }
  }

  chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }
}
