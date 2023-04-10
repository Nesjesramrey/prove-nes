import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';
import { catchError, of, throwError } from "rxjs";

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
    ).pipe(catchError(error => of(error)));
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

  categorizePost(data: any) {
    return this.httpClient.post(
      this.endPointService.apiEndPoint + this.endPointService.categorizePostEndPoint, data
    );
  }

  filterPosts(data: any) {
    return this.httpClient.get(
      this.endPointService.apiEndPoint + this.endPointService.filterPostsEndPoint + `?filter=${data['filter']}&coverage=${data['coverage']}`, {}
    );
  }
}
