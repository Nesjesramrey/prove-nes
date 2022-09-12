import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) {}

  // fetchSingleSolutionById(data: any) {
  //   return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSingleSolutionByIdEndPoint + `${data['_id']}`, {});
  // }

  // createNewSolution(data: any) {
  //   return this.httpClient.post(
  //     this.endpointSrvc.apiEndPoint +
  //       this.endpointSrvc.createNewSolutionEndPoint +
  //       `${data['topic']}`,
  //     data['formData']
  //   );
  // }
  createNewVoto(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewVoteEndPonint,
      data
    );
  }
}
