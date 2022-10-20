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

  ngOnInit(): void { }

  addFirstTestimony() {
    this.sendTestimonyData.emit({ add: true });
  }
}
