import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

export interface ICategoryFormat {
  title: string;
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
  public categories: any = [];
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  @Input() data: any[] = [];
  @Input() selectedID: string = '';

  constructor(
    public utilityService: UtilityService,
    public activatedRoute: ActivatedRoute
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID =
      this.activatedRoute['snapshot']['params']['subcategoryID'];
  }

  ngOnInit(): void {
    this.loadSubcategories();
  }

  loadSubcategories() {
    const sizes = [25, 35, 44];
    const opacities = [0.5, 1];
    let maxX = 600;
    let maxY = 700;

    this.categories = this.data.map((item) => {
      item.size = item._id === this.selectedID ? 38 : 20;
      item.opacity = item._id === this.selectedID ? 1 : 0.8;
      if (item.title.length > 12) {
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

  redirect(id: string) {
    const path = `documentos-publicos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/tema/${id}`;

    this.utilityService.linkMe(path);
  }
}
