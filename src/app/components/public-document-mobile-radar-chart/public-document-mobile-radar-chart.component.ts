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
        display: true,
        text: 'Tópicos'
      },
      legend: {
        display: false
      }
    }
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
      x['subLayouts'].filter((y: any) => {
        y['topics'].filter((t: any) => {
          this.topics.push(t);
        });
      });
    });

    this.topics.filter((t: any) => {
      this.radarChartLabels.push(t['title']);
      this.radarChartData['datasets'][0]['data'].push(t['stats']['score']);
      // this.radarChartData['datasets'][0]['data'].push(t['stats']['interactions']);
    });
  }

  chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }
}
