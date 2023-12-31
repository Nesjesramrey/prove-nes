import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class VisitService {
  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  sendVisit(relationId: string, type: string) {
    const data = {
      id: relationId,
      type: type,
    };

    this.sendVisitOfCollection(data).subscribe({
      error: (error: any) => {
        // console.log(error);
      },
      next: (reply: any) => {
        // console.log(reply);
      },
      complete: () => { }
    });
  }

  fetchSingleTestimonyById(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSingleTestimonyByIdEndPoint + `${data['_id']}`, {}
    );
  }

  createNewTestimony(data: any) {
    return this.httpClient.post(
      // this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewTestimonyEndPoint + `${data.id}` + `/?type=${data.type}`, data['form']
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewTestimonyEndPoint + `${data.id}`, data['form']
    );
  }

  sendVisitOfCollection(data: any) {
    return this.httpClient.post(
      // this.endpointSrvc.apiEndPoint + this.endpointSrvc.sendVisitEndPoint + `${data.id}` + `/?type=${data.type}`, {}
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.sendVisitEndPoint + `${data.id}`, data
    );
  }
}
