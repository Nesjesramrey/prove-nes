import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  fetchSingleLayoutById(data: any) {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSingleLayoutByIdEndPoint + `${data['_id']}`, {});
  }

  createNewLayoutOnly(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewLayoutOnlyEndPoint + `${data['documentID']}?createOnlyLayout=true`, data['formData']);
  }

  createNewSubLayout(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewSubLayoutEndPoint + `${data['category']}`, data['formData']);
  }
}
