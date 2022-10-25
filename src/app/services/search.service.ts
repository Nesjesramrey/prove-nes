import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public searchSubject!: BehaviorSubject<any>;

  constructor(
    public httpClient: HttpClient,
    public endPointService: EndPointService
  ) {
    this.searchSubject = new BehaviorSubject<any>(null);
  }

  globalSearch(data: any) {
    return this.httpClient.get(this.endPointService.apiEndPoint + this.endPointService.globalSearchEndPoint + `?id=${data['document_id']}&filter=${data['filter']}`);
  }
}
