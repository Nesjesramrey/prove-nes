import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) {}

  fetchSingleCommentById(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint +
        this.endpointSrvc.fetchSingleCommentByIdEndPoint +
        `${data['_id']}`,
      {}
    );
  }

  createNewComment(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint +
        this.endpointSrvc.createNewCommentEndPoint +
        `${data.id}` +
        `/?type=${data.type}`,
      data.data
    );
  }
}
