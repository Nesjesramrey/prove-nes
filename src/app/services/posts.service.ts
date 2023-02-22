import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    public httpClient: HttpClient,
    public endPointService: EndPointService
  ) { }

  fetchAllPosts(data: any) {
    return this.httpClient.get(
      this.endPointService.apiEndPoint + this.endPointService.fetchAllPostsEndPoint + `?limitPerPage=${data['limit']}&page=${data['page']}`
    );
  }

  fetchPostByRelationId(data: any) {
    return this.httpClient.get(
      this.endPointService.apiEndPoint + this.endPointService.fetchPostByRelationIdEndPoint + data['relationId']
    );
  }

  addPostComment(data: any) {
    return this.httpClient.post(
      this.endPointService.apiEndPoint + this.endPointService.addPostCommentEndPoint + data['postID'] + '/comment', data
    );
  }
}
