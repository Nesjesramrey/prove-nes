import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';

@Injectable()
export class DocumentService {

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  createNewDocument(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewDocumentEndPoint, data);
  }

  fetchMyDocuments(data: any) {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewDocumentEndPoint + `?createdBy=${data['createdBy']}`, {});
  }

  fetchSingleDocumentById(data: any) {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSingleDocumentByIdEndPoint + `${data['_id']}`, {});
  }

  fetchDocumentsByCollaborator(data: any) {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchDocumentsByCollaboratorEndPoint + `${data['_id']}`, {});
  }

  createDocumentLayout(data: any) {
    for (var pair of data.formData.entries()) { console.log(pair[0] + ', ' + pair[1]); }
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.createDocumentLayoutEndPoint + `${data['documentID']}`, data['formData']);
  }












  fetchEditorDocuments(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchEditorDocumentsEndPoint, data);
  }

  addDocumentLayout(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.addDocumentLayoutEndPoint, data);
  }




  addDocumentCollaborator(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.addDocumentCollaboratorEndPoint, data);
  }

  addDocumentColumn(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.addDocumentColumnEndPoint, data);
  }
}
