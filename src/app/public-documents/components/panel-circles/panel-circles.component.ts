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
  public image: string = '../../../assets/images/not_fount.jpg';
  public slices: any[] = [];
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
    // const opacities = [0.75, 1];
    let maxX = 5;
    let maxY = 20;

    const data = this.document ? this.document.layouts : this.data;
    this.categories = data.map((item: any, index: any) => {
      this.categoryLength = data.length;
      const background = item.images.length > 0 ? item.images[0] : this.image;

      const obj = {
        id: item._id,
        title: item.category?.name || item.name,
        value: Math.floor(Math.random() * 1500),
        out_circle: false,
        out_circle_color: '#71f5ad',
        in_circle_background: background,
        // border: this.withBorder ? 'none' : '4px solid #71f5ad',
        overlay: 'transparent',
        // opacity: 1,
        opacity: 1,
        box: this.withBorder ? 88 : 100,
        // size: sizes[Math.floor(Math.random() * 2)],
        size: this.getSize(
          item.category.name.split(' ').length > 1 ||
            item.category.name.length > 10
            ? 'large'
            : sizes[Math.floor(Math.random() * 2)]
        ),
        position: this.getPosition(),
        pos: {
          x: maxX,
          y: maxY,
        },
      };
      const titleArr = obj.title.split(' ');
      maxX += 0;
      maxY += 10;
      obj.title =
        titleArr.length > 4
          ? `${titleArr[0]} ${titleArr[1]} ${titleArr[2]}`
          : obj.title;

      return obj;
    });
    const cLength = this.categoryLength;
    //2 5 8 10

    const setSizes = [6, 4, 2];
    const set =
      cLength < 6
        ? setSizes[0]
        : cLength < 9
          ? setSizes[1]
          : cLength < 11 && setSizes[2];

    const dat = [
      {
        set: set,
        margin: '30px',
        data: this.categories.slice(0, 2),
      },
      {
        set: set,
        margin: '15px 40px',
        data: this.categories.slice(2, 5),
      },
      {
        set: set,
        margin: '15px 60px',
        data: this.categories.slice(5, 8),
      },
      {
        set: set,
        margin: '8px 20px',
        data: this.categories.slice(8, 10),
      },
    ];

    this.slices =
      set == 6 ? dat.slice(0, 2) : set == 4 ? dat.slice(0, 3) : dat.slice(0, 4);
    if (cLength > 10) {
      this.categories = this.categories.slice(10, cLength);
    }
  }

  getPosition() {
    const d = this.withBorder ? 30 : 20;
    const xR = Math.floor(Math.random() * 20);
    const yR = Math.floor(Math.random() * 2);

    return { x: xR, y: yR };
  }

  getSize(size: string): any {
    if (size === 'small')
      return {
        width: 140,
        height: 140,
        font: 16,
      };
    if (size === 'medium')
      return {
        width: 145,
        height: 145,
        font: 16,
      };
    if (size === 'large')
      return {
        width: 168,
        height: 168,
        font: 16,
      };
  }

  redirect(id: string) {
    const isCategory = this.redirectTo === 'CATEGORY';
    const type = isCategory ? id : `${this.categoryID}/subcategoria/${id}`;

    this.utilityService.linkMe(
      `documentos-publicos/${this.documentID}/categoria/${type}`
    );
  }
}
