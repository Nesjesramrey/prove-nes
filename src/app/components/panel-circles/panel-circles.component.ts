import { Component, Input, OnInit } from '@angular/core';

export interface ICategoryFormat {
  name: string;
  quantity: string;
  pos: {
    x: number;
    y: number;
  };
  size: number;
  opacity: number;
}
export interface ICategory {
  name: string;
}
@Component({
  selector: 'panel-circles',
  templateUrl: './panel-circles.component.html',
  styleUrls: ['./panel-circles.component.scss'],
})
export class PanelCirclesComponent implements OnInit {
  public categories: ICategoryFormat[] = [];
  public expanded: boolean = false;

  @Input('user') public user: any = null;
  @Input() data: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    const sizes = [15, 25, 34];
    const opacities = [0.5, 1];
    let maxX = 100;
    let maxY = 200;
    this.categories = this.data.map((item) => {
      item.size = sizes[(Math.random() * sizes.length) | 0];
      item.opacity = opacities[(Math.random() * opacities.length) | 0];

      item.pos = {
        x: maxX,
        y: maxY,
      };
      maxX = maxX + 450;
      return item;
    });
  }

  expandBox() {
    this.expanded = !this.expanded;
  }
  // toggleVisibility() {
  //   this.isVisible = !this.isVisible;
  //   this.expanded = false;
  // }
}
