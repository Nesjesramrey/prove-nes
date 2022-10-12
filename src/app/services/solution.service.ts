import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class SolutionService {

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  fetchSingleSolutionById(data: any) {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSingleSolutionByIdEndPoint + `${data['_id']}`, {});
  }

  createNewSolution(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewSolutionEndPoint + `${data['topic']}`, data['formData'])
  }

  getTopSolutionsByDocument(id: any) {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.getTopSolutionByDocumentEndPoint + `${id}`, {})
  }

  getTopSolutionsByLayout(id: any) {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.getTopSolutionByLayoutEndPoint + `${id}`, {})
  }

  updateSolutionData(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.updateSolutionDataEndPoint + `${data['solution_id']}`, data
    )
  }
}
