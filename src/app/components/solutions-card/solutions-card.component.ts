import { Component, Input, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'solutions-card',
  templateUrl: './solutions-card.component.html',
  styleUrls: ['./solutions-card.component.scss'],
})
export class SolutionsCardComponent implements OnInit {
  @Input() data: any = [];

  constructor(private utilityService: UtilityService) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  redirect(id: string) {
    // const path = `documentos/publico/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/tema/${id}`;
    const path = 'documentos/publico/solucion';
    this.utilityService.linkMe(path);
  }
}
