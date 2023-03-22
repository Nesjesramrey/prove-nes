import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  createTeam(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createTeamEndPoint, data
    );
  }

  leaderStatus(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.leaderStatusEndPoint + data['userID'], {}
    ).pipe(catchError(error => of(error)));
  }

  assignTeamCollaborators(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.assignTeamCollaboratorsEndPoint + data['teamID'], data
    );
  }

  setTeamCategories(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.setTeamCategoriesEndPoint + data['teamID'], data
    );
  }

  fetchTeamById(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchTeamByIdEndPoint + data['teamID'], {}
    );
  }

  assignTeamTopic(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.assignTeamTopicEndPoint + data['teamID'], data
    );
  }

  uploadCoverImage(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.uploadCoverImageEndPoint + data['teamID'] + '/cover_image', data['formData']
    );
  }

  uploadTeamAvatar(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.uploadTeamAvatarEndPoint + data['teamID'] + '/avatar_image', data['formData']
    );
  }

  killTeamCollaborator(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.killTeamCollaboratorEndPoint + data['teamID'], data
    );
  }

  upoloadProposal(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.upoloadProposalEndPoint + data['teamID'] + '/problematic_proposal', data['formData']
    );
  }

  fetchAllTeams() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllTeamsEndPoint, {}
    );
  }
}
