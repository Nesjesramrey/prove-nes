import { Color } from '@alyle/ui/color';
import { Component, OnInit } from '@angular/core';

export interface Data {
  title: string;
  value: number;
  out_circle: boolean;
  in_circle_background: string;
  out_circle_color: string;
  overlay: any;
}

@Component({
  selector: 'app-circumference-custon',
  templateUrl: './circumference-custon.component.html',
  styleUrls: ['./circumference-custon.component.scss'],
})
export class CircumferenceCustonComponent implements OnInit {
  data: Data = {
    title: 'Economía',
    value: 1500,
    out_circle: true,
    in_circle_background: '#ff6d00',
    out_circle_color: '#ff6d00',
    overlay: '#ff6d00',
  };
  constructor() {}

  ngOnInit(): void {
    if (this.data.out_circle == false) {
      this.data.out_circle_color = 'transparent';
    }
  }
}
