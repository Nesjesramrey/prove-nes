import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class TestimonyService {

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  fetchSingleTestimonyById(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSingleTestimonyByIdEndPoint+ `${data['testimonyID']}`, {}
    );
  }

  createNewTestimony(data: any) {
    return this.httpClient.post(
      // this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewTestimonyEndPoint + `${data.id}` + `/?type=${data.type}`, data['formData']
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewTestimonyEndPoint + `${data.id}`, data['formData']
    );
  }

  fetchAllTestimonies() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllTestimoniesEndPoint, {}
    );
  }
}
