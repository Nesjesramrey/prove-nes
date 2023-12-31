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
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSingleTestimonyByIdEndPoint + `${data['testimonyID']}`, {}
    );
  }

  createNewTestimony(data: any) {
    return this.httpClient.post(
      // this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewTestimonyEndPoint + `${data.id}` + `/?type=${data.type}`, data['formData']
      // this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewTestimonyEndPoint + `${data.id}`, data['formData']
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewTestimonyEndPoint, data['formData']
    );
  }

  fetchAllTestimonies() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllTestimoniesEndPoint, {}
    );
  }

  killTestimony(data: any) {
    return this.httpClient.delete(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.killTestimonyEndPoint + data['testimony_id'], {}
    );
  }

  fetchTopicTestimonies(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchTopicTestimoniesEndPoint + `?topic=${data['topic']}`, {}
    );
  }
}
