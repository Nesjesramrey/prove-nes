import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class ComplaintService {
  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  fileComplaint(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fileComplaintEndPoint, data
    );
  }

  fetchAllComplaints() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllComplaintsEndPoint, {}
    );
  }

  fetchComplaintById(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchComplaintByIdEndPoint, data
    );
  }

  killComplaint(data: any) {
    return this.httpClient.delete(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.killComplaintEndPoint + `/${data['complaint_id']}`, data
    );
  }
}
