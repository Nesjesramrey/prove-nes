import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  public accessToken: any = null;

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService,
  ) {
  }

  createNewVoto(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewVoteEndPonint, data
    );
  }

  deleteVote(data: any) {
    return this.httpClient.delete(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.deleteVoteEndPonint + data['_id']
    );
  }

  fetchVotesByTopicID(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchVotesFromTopicEndPonint + data['_id']);
  }

  fetchVotesBySolutionID(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchVotesFromSolutionEndPonint + data['_id']
    );
  }
}
