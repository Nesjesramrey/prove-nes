import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';


@Component({
  selector: 'sheet-feed',
  templateUrl: './sheet-feed.component.html',
  styleUrls: ['./sheet-feed.component.scss']
})
export class SheetFeedComponent implements OnInit {

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SheetFeedComponent>
  ) { }
  
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  ngOnInit(): void {
  }

}
