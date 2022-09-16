import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'circle-custom',
  templateUrl: './circle-custom.component.html',
  styleUrls: ['./circle-custom.component.scss'],
})
export class CircleCustomComponent implements OnInit {
  @Input() data: any;
  @Input() size: string = 'medium';
  @Input() position: number = 0;
  @Input('categoryLength') categoryLength: any;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.data.position = this.getPosition(this.position);
      this.data.size = this.getSize(this.size);
    }, 200);
    if (this.data.out_circle == false) {
      this.data.out_circle_color = 'transparent';
    }
  }

  getSize(size: string): any {
    if (size === 'small') return {
      box: 134, font: 11,
      left: 10, top: 50
    };
    if (size === 'medium') return {
      box: 154, font: 16,
      left: 10, top: 50
    };
    if (size === 'large') return {
      box: 249, font: 22,
      left: 10, top: 50
    };

  }

  getPosition(position: number): any {

    const basePosition = [
      { left: 0, top: 30 },
      { left: 0, top: 20 },
      { left: 0, top: 20, right: -90 }
    ]

    let contador = 0;
    for (let i = 0; i <= this.categoryLength; i++) {
      if (i === position) {
        if (contador === 0) {
          switch (this.size) {
            case 'large':
              basePosition[contador].left = 10;
              basePosition[contador].top = 15;
              break;
            case 'medium':
              basePosition[contador].left = 7;
              basePosition[contador].top = 15;
              break;
            case 'small':
              basePosition[contador].left = 10;
              basePosition[contador].top = 15;
              break;
          }
          return basePosition[contador];
        } else if (contador === 1) {
          switch (this.size) {
            case 'large':
              basePosition[contador].left = 10;
              basePosition[contador].top = -3;
              break;
            case 'medium':
              basePosition[contador].left = -2;
              basePosition[contador].top = 40;
              break;
            case 'small':
              basePosition[contador].left = -15;
              basePosition[contador].top = 50;
              break;
          }
          return basePosition[contador];
        } else {
          switch (this.size) {
            case 'large':
              basePosition[contador].left = -19;
              basePosition[contador].top = 50;
              basePosition[contador].right = -20;
              break;
            case 'medium':
              basePosition[contador].left = 6;
              basePosition[contador].top = 128;
              basePosition[contador].right = -50;
              break;
            case 'small':
              basePosition[contador].left = -15;
              basePosition[contador].top = 370;
              basePosition[contador].right = -90;
              break;
          }
          return basePosition[contador];
        }
      }
      contador++;
      if (contador === 3) contador = 0;
    }


  }

}
export interface Data {
  title: string;
  value: number;
  out_circle: boolean;
  in_circle_background: string;
  out_circle_color: string;
  overlay: any;
  size: {
    box: number;
    font: number;
  };
  opacity: number;
  pos?: {
    x: number;
    y: number;
  };
}