import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'circle-custom',
  templateUrl: './circle-custom.component.html',
  styleUrls: ['./circle-custom.component.scss'],
})
export class CircleCustomComponent implements OnInit {
  @Input() data: any;
  @Input() size: string = 'medium';
  @Input() position: string = 'firts';

  constructor() {}

  ngOnInit(): void {
    this.data.size = this.getSize(this.size);
    this.data.position = this.getPosition(this.position);
    if (this.data.out_circle == false) {
      this.data.out_circle_color = 'transparent';
    }
  }

  getSize(size: string): any {
    // if (this.data.title.length > 13) return { box: 250, font: 24 };
    if (size === 'small') return { box: 250, font: 28 };
    if (size === 'medium') return { box: 170, font: 16 };
    if (size === 'large') return { box: 230, font: 26 };
  }

  getPosition(position: string): any {
    if (position === 'first')
      return { left: 50, top: -60, position: 'relative' };
    if (position === 'second')
      return { left: -10, top: -90, position: 'relative' };
    if (position === 'third')
      return { left: -70, top: 20, position: 'relative' };
  }
}
