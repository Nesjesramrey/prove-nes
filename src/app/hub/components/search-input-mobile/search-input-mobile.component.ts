import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'search-input-mobile',
  templateUrl: './search-input-mobile.component.html',
  styleUrls: ['./search-input-mobile.component.scss']
})
export class SearchInputMobileComponent implements OnInit {
  public formGroup!: FormGroup;
  @Input() value: string | undefined;

  constructor(
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.formGroup = this.formBuilder.group({
      contents: ["", [Validators]],
    })
  }


  }
