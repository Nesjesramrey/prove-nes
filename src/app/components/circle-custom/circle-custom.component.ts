import { Color } from '@alyle/ui/color';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    console.log({ dataCircle: this.data });
    this.data.size = this.processSize(this.size);
    this.data.position = this.processPosition(this.position);
    if (this.data.out_circle == false) {
      this.data.out_circle_color = 'transparent';
    }
  }

  processSize(size: string): any {
    // if (this.data.title.length > 13) return { box: 250, font: 24 };
    if (size === 'small') return { box: 250, font: 28 };
    if (size === 'medium') return { box: 170, font: 16 };
    if (size === 'large') return { box: 230, font: 26 };
  }
  processPosition(position: string): any {
    if (position === 'first')
      return { left: 50, top: -60, position: 'relative' };
    if (position === 'second')
      return { left: -10, top: -90, position: 'relative' };
    if (position === 'third')
      return { left: -70, top: 20, position: 'relative' };
  }
}
