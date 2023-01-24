import { Component, OnInit, Inject } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';


@Component({
  selector: 'sheet-feed',
  templateUrl: './sheet-feed.component.html',
  styleUrls: ['./sheet-feed.component.scss']
})
export class SheetFeedComponent implements OnInit {
  public user: any = null;
  public url: string = '';

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SheetFeedComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: any,
    public router: Router,
    public utilityService: UtilityService
  ) { 
    this.user = this.sheetData['user'];
  }
  
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  ngOnInit(): void {
  }

}
