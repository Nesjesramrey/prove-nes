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
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchMyDocumentsEndPoint, data);
  }

  fetchSingleDocumentById(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSingleDocumentByIdEndPoint, data);
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
