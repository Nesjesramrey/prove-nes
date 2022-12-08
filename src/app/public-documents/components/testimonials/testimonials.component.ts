import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'public-documents-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
})
export class TestimonialsComponent implements OnInit {
  @Input('data') data: any = [];
  @Output() public sendTestimonyData = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
    this.sortData();
  }

  addFirstTestimony() {
    this.sendTestimonyData.emit({ add: true });
  }

  sortData() {
    return this.data.sort((a: any, b: any) => {
      return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
    });
  }
}
