import { Component, Input, OnInit } from '@angular/core';

export interface ICategoryFormat {
  name: string;
  pos: {
    x: number;
    y: number;
  };
  size: number;
  opacity: number;
}

@Component({
  selector: 'panel-subcategory',
  templateUrl: './panel-subcategory.component.html',
  styleUrls: ['./panel-subcategory.component.scss'],
})
export class PanelSubcategoryComponent implements OnInit {
  public categories: ICategoryFormat[] = [];
  @Input() data: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadSubcategories();
  }

  loadSubcategories() {
    const sizes = [15, 25, 34];
    const opacities = [0.5, 1];
    let maxX = 600;
    let maxY = 700;

    this.categories = this.data.map((item) => {
      item.size = sizes[(Math.random() * sizes.length) | 0];
      item.opacity = opacities[(Math.random() * opacities.length) | 0];
      item.name = item.category.name;
      if (item.category.name.length > 12) {
        maxX = 400;
      } else {
        maxX = 600;
      }

      item.pos = {
        x: Math.floor(Math.random() * (maxX + 1) + 0),
        y: Math.floor(Math.random() * (maxY + 1) + 0),
      };
      return item;
    });
  }
}
