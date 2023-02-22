import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
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
  @Input('updated') updated!: Subject<any>;

  constructor(
    public utilityService: UtilityService,
    public activatedRoute: ActivatedRoute
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
  }

  ngOnInit(): void {
    this.loadSubcategories();
    this.updated.subscribe(data => {
      this.data = [];
      this.data = data;
      this.loadSubcategories();
    });
  }

  loadSubcategories() {
    let maxX = 250;
    let maxY = 700;
    this.categories = this.data.map((item) => {
      item.shortTitle = this.shortTitle(item.title, 4);
      item.size = item._id === this.selectedID ? 38 : 20;
      item.opacity = item._id === this.selectedID ? 1 : 0.8;
      if (item.title.length > 10) {
        maxX = 250;
      } else {
        maxX = 450;
      }
      item.pos = {
        x: Math.floor(Math.random() * (maxX + 1) - 190),
        y: Math.floor(Math.random() * (maxY + 1) + 0),
      };
      return item;
    });
    this.categories = this.categories.slice(0, 10);
  }

  shortTitle(title: string, size: number) {
    const short = title.split(' ');
    if (short.length > size) {
      let shortTitle = '';
      for (let i = 0; i < size; i++) {
        shortTitle += short[i] + ' ';
      }
      return shortTitle + '...';
    }
    return title;
  }

  redirect(id: string) {
    const path = `documentos-publicos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/tema/${id}`;
    this.utilityService.linkMe(path);
  }
}
