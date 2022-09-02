import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';

export interface ICategoryFormat {
  id: string;
  title: string;
  value: number;
  out_circle: boolean;
  in_circle_background: string;
  out_circle_color: string;
  opacity: number;
  size: string;
  position: string;
  pos?: {
    x: number;
    y: number;
  };
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
  @Input() document: any;
  @Input() withBorder: boolean = false;
  @Input() redirect: EventEmitter<any> | undefined;
  // @Input() redirect: any = false;

  constructor(public utilityService: UtilityService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    const sizes = ['small', 'medium', 'large'];
    const opacities = [0.75, 1];
    const positions = ['first', 'second', 'third'];
    let maxX = 20;
    let maxY = 20;

    const data = this.document ? this.document.layouts : this.data;
    console.log({ documento: data });

    this.categories = data.map((item: any, index: any) => {
      const background = this.withBorder
        ? '#ff6d00'
        : '../../../assets/images/books.png';

      const obj = {
        id: item._id,
        title: item.category?.name || item.name,
        value: 1500,
        out_circle: this.withBorder,
        out_circle_color: '#ff6d00',
        in_circle_background: background,
        overlay: 'transparent',
        // opacity: 1,
        opacity: opacities[(Math.random() * opacities.length) | 0],
        size: sizes[index],
        position: positions[index],
        pos: {
          x: maxX,
          y: maxY,
        },
      };
      maxX += 0;
      maxY += 10;

      return obj;
    });
  }

  redirectTo(id: string) {
    this.utilityService.linkMe(
      `documentos/publico/${this.document._id}/categoria/${id}`
    );
  }
}
