import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PostsSheetMenuComponent } from '../posts-sheet-menu/posts-sheet-menu.component';

@Component({
  selector: '.posts-floating-menu',
  templateUrl: './posts-floating-menu.component.html',
  styleUrls: ['./posts-floating-menu.component.scss']
})
export class PostsFloatingMenuComponent implements OnInit {
  @Input('user') public user: any = null;

  constructor(
    public matBottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    switch (this.user['status']) {
      case 500:
        this.user = null;
        break;
    }
  }

  displayMenu() {
    // this.open = !this.open;
    const bottomSheetRef = this.matBottomSheet.open(PostsSheetMenuComponent, {
      data: { user: this.user }
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
