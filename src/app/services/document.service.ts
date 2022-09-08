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
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.createDocumentLayoutEndPoint + `${data['documentID']}`, data['formData']);
  }

  editDocumentData(data: any) {
    return this.httpClient.put(this.endpointSrvc.apiEndPoint + this.endpointSrvc.editDocumentDataEndPoint + `${data['documentID']}`, data);
  }

  fetchCoverDocument() {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchCoverDocumentEndPoint, {});
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
