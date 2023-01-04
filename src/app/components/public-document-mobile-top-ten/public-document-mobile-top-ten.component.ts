import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';
import { FilterCoverageDialogComponent } from '../filter-coverage-dialog/filter-coverage-dialog.component';

@Component({
  selector: '.public-document-mobile-top-ten',
  templateUrl: './public-document-mobile-top-ten.component.html',
  styleUrls: ['./public-document-mobile-top-ten.component.scss']
})
export class PublicDocumentMobileTopTenComponent implements OnInit {
  @Input('coverage') public coverage: any = null;
  @Input('solutions') public solutions: any = null;
  @Input('storedSolutions') public storedSolutions: any = null;
  @Input('open') public open: boolean = false;
  @Output() public openMenu = new EventEmitter<any>();

  constructor(
    public utilityService: UtilityService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.solutions.filter((x: any) => {
      if (x['stats'] == null) { x['stats'] = { score: 0 } }
    });
    this.sortSolutions(this.solutions);
    this.solutions = this.solutions.slice(0, 10);
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }

  sortSolutions(data: any) {
    return data.sort((a: any, b: any) => {
      return b.stats.score - a.stats.score;
    });
  }

  displayCoverageMenu() {
    // this.open = !this.open;
    // this.openMenu.emit({ open: this.open });

    const dialogRef = this.dialog.open<any>(
      FilterCoverageDialogComponent, {
      width: '100%',
      data: {
        coverage: this.coverage
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.solutions = this.storedSolutions.filter((x: any) => {
          return x['coverage'][0]['_id'] == reply['selectedCoverage'];
        });
      }
    });
  }
}
