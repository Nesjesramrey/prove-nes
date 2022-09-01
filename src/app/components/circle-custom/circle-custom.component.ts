import { Color } from '@alyle/ui/color';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'circle-custom',
  templateUrl: './circle-custom.component.html',
  styleUrls: ['./circle-custom.component.scss'],
})
export class CircleCustomComponent implements OnInit {
  @Input() data: any;
  @Input() size: string = 'medium';

  constructor() {}

  ngOnInit(): void {
      this.data.size = this.processSize(this.size);
      if (this.data.out_circle == false) {
        this.data.out_circle_color = 'transparent';
      }
  }

  processSize(size: string): any {
    if (this.data.title.length > 13) return { box: 250, font: 24 };
    if (size === 'small') return { box: 140, font: 18 };
    if (size === 'medium') return { box: 235, font: 22 };
    if (size === 'large') return { box: 250, font: 28 };
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
