import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ComponentsModule } from '../components/components.module';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  fetchSingleCommentById(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint +
      this.endpointSrvc.fetchSingleCommentByIdEndPoint +
      `${data['_id']}`,
      {}
    );
  }

  createNewComment(data: any) {
    console.log(data);
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewCommentEndPoint + `${data.id}` + `/?type=${data.type}`, data.data
    );
  }

  finRelationIdComment(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint +
      this.endpointSrvc.findRelationIdEndPoint + '/' + data.documentId);
  }

  createNewDocumentComment(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewDocumentCommentEndPoint + `${data['location_id']}` + '/document', data['formData']
    );
  }

  fetchDocumentComments(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchDocumentCommentsEndPoint + `${data['location_id']}` + '/document', {}
    );
  }

  createNewLayoutComment(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewLayoutCommentEndPoint + `${data['document_id']}` + '/layout/' + `${data['location_id']}`, data['formData']
    );
  }

  fetchLayoutComments(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchLayoutCommentsEndPoint + `${data['document_id']}` + '/layout/' + `${data['location_id']}`, {}
    );
  }

  createNewSubLayoutComment(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewSubLayoutCommentEndPoint + `${data['document_id']}` + '/sublayout/' + `${data['location_id']}`, data['formData']
    );
  }

  createNewTopicComment(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewTopicCommentEndPoint + `${data['document_id']}` + '/topic/' + `${data['location_id']}`, data['formData']
    );
  }

  fetchTopicComments(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchTopicCommentsEndPoint + `${data['document_id']}` + '/topic/' + `${data['location_id']}`, {}
    );
  }

  createNewSolutionComment(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewSolutionCommentEndPoint + `${data['document_id']}` + '/solution/' + `${data['location_id']}`, data['formData']
    );
  }

  fetchSolutionComments(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSolutionCommentsEndPoint + `${data['document_id']}` + '/solution/' + `${data['location_id']}`, {}
    );
  }

  fetchCommentById(data: any) {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchCommentByIdEndPoint + `${data['comment_id']}`, {});
  }

  killDocumentComment(data: any) {
    return this.httpClient.delete(this.endpointSrvc.apiEndPoint + this.endpointSrvc.killDocumentCommentEndPoint + `${data['comment_id']}`, {});
  }

  replyDocumentComments(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.replyDocumentCommentsEndPoint + `${data['comment_id']}` + '/response', data);
  }
}
