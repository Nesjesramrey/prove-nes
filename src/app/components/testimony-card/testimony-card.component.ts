import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'testimony-card',
  templateUrl: './testimony-card.component.html',
  styleUrls: ['./testimony-card.component.scss'],
})
export class TestimonyCardComponent implements OnInit {
  @Input() data: any = [];

  constructor() {}

  ngOnInit(): void {}
}
