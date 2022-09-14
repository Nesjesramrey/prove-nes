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
    if (size === 'small') return { box: 250, font: 28 };
    if (size === 'medium') return { box: 170, font: 16 };
    if (size === 'large') return { box: 230, font: 26 };
  }

  getPosition(position: number): any {
    const leftBase = position % Math.floor(Math.random() * 2) == 0 ? -40 : 10;

    return {
      left: 50 + leftBase,
      top: -60 + position * 10,
      position: 'relative',
    };
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