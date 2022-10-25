import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: '.search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public searchResults: any = null;

  constructor(
    public searchService: SearchService,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.searchService.searchSubject.subscribe((reply: any) => {
      this.searchResults = reply;
      // console.log('searchResults: ', this.searchResults);
      if (this.searchResults == null) {
        this.utilityService.linkMe('/404');
        return;
      }
      this.searchResults.filter((x: any) => {
        switch (x['type']) {
          case 'layout':
            x['typeName'] = 'Categoría'
            break;

          case 'sublayout':
            x['typeName'] = 'Sub categoría'
            break;

          case 'topic':
            x['typeName'] = 'Problemática'
            break;

          case 'solution':
            x['typeName'] = 'Solución'
            break;
        }
      });
      // console.log('searchResults: ', this.searchResults);
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }
}
