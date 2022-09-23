import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService,
  ) { }

  editCategory(data: any) {
    return this.httpClient.put(this.endpointSrvc.apiEndPoint + this.endpointSrvc.editCategoryEndPoint + `${data['categoryID']}`, data);
  }
}
