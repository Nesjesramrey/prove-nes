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

  editLayoutData(data: any) {
    return this.httpClient.put(this.endpointSrvc.apiEndPoint + this.endpointSrvc.editLayoutDataEndPoint + `${data['layoutID']}`, data);
  }

  uploadLayoutFiles(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.uploadLayoutFilesEndPoint + `${data['layout_id']}` + '/images', data['formData']);
  }

  killLayoutImage(data: any) {
    return this.httpClient.delete(this.endpointSrvc.apiEndPoint + this.endpointSrvc.killLayoutImageEndPoint + `${data['layout_id']}` + '/images', { body: data });
  }

  addLayoutCollaborator(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.addLayoutCollaboratorEndPoint, data);
  }
}
