import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  position: number;
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

  public categoryID: string = '';
  public documentID: string = '';

  @Input() data: any[] = [];
  @Input() document: any = '';
  @Input() withBorder: boolean = false;
  @Input() redirectTo: string | undefined = '';
  @Output('categoryLength') categoryLength: number = 0;

  constructor(
    public utilityService: UtilityService,
    public activatedRoute: ActivatedRoute
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    const sizes = ['small', 'medium', 'large'];
    const opacities = [0.75, 1];
    let maxX = 5;
    let maxY = 20;

    const data = this.document ? this.document.layouts : this.data;
    this.categories = data.map((item: any, index: any) => {
      this.categoryLength = data.length;
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
        size: sizes[Math.floor(Math.random() * 3)],
        position: index,
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

  redirect(id: string) {
    const isCategory = this.redirectTo === 'CATEGORY';
    const type = isCategory ? id : `${this.categoryID}/subcategoria/${id}`;

    this.utilityService.linkMe(
      `documentos-publicos/${this.documentID}/categoria/${type}`
    );
  }
}
