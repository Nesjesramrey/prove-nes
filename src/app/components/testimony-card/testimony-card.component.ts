import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'testimony-card',
  templateUrl: './testimony-card.component.html',
  styleUrls: ['./testimony-card.component.scss'],
})
export class TestimonyCardComponent implements OnInit {
  public solutionsTotal: number = 2000;
  public problemsTotal: number = 1200;

  constructor() { }

  ngOnInit(): void { }
}
