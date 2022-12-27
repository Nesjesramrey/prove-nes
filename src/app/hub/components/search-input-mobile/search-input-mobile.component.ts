import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'search-input-mobile',
  templateUrl: './search-input-mobile.component.html',
  styleUrls: ['./search-input-mobile.component.scss']
})
export class SearchInputMobileComponent implements OnInit {
  @Input() value: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }


  }
