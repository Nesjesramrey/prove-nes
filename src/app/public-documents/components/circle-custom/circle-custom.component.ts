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

  constructor() {}

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
    if (size === 'small') return { box: 130, font: 11 };
    if (size === 'medium') return { box: 170, font: 16 };
    if (size === 'large') return { box: 230, font: 22 };
  }

  getPosition(position :number): any {
    const basePosition = [
      { left : -14 , top: 80 , position : 'relative' },
      { left : -42 , top: -84 ,position : 'relative' },
      { left : -75 , top: 75 , position : 'relative' },
  ];

  for(let i = 0; i<10; i++){
        if(i === position){
          if(this.size === 'small' && i%2 === 0) basePosition[i].top = 118;
          if(this.size !== 'large' && i%2 !== 0) basePosition[i].top = -70;
          return basePosition[i];
        }}
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