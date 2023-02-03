import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.share-sheet',
  templateUrl: './share-sheet.component.html',
  styleUrls: ['./share-sheet.component.scss']
})
export class ShareSheetComponent implements OnInit {
  public user: any = null;
  public url: string = '';
  public card: any = null;

  constructor(
    public bottomSheetRef: MatBottomSheetRef<ShareSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: any,
    @Inject(DOCUMENT) public DOM: Document,
    public router: Router,
    public utilityService: UtilityService
  ) {
    // console.log(this.sheetData);
    this.user = this.sheetData['user'];
    this.url = this.DOM.location.origin + this.router.url;
    if (this.sheetData['card'] != undefined) {
      this.card = this.sheetData['card'];
      this.url = this.DOM.location.origin + this.router.url + '/' + this.card['_id'];
    }
  }

  ngOnInit(): void { }

  copyToClipboard() {
    this.utilityService.openSuccessSnackBar('Se ha copiado al clipboard');
  }

  killSheet() {
    this.bottomSheetRef.dismiss();
  }
}
