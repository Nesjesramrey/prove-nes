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

  constructor() {}

  ngOnInit(): void {

    if (this.data.out_circle == false) {
      this.data.out_circle_color = 'transparent';
    }
  }

  getPosition() {
    const xR = Math.floor(Math.random() * 80);
    const yR = Math.floor(Math.random() * 5);

    return { x: xR, y: yR };
  }

  getSize(size: string): any {

    if (size === 'medium')
      return {
        width: 160,
        height: 150,
        font: 16,
      };
    if (size === 'large')
      return {
        width: 180,
        height: 150,
        font: 20,
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
