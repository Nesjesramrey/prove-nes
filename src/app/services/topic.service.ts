import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) {}

  createNewTopic(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint +
        this.endpointSrvc.createNewTopicEndPoint +
        `${data['layout_id']}`,
      data['formData']
    );
  }

  fetchSingleTopicById(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint +
        this.endpointSrvc.fetchSingleTopicByIdEndPoint +
        `${data['_id']}`
    );
  }

  uploadTopicFiles(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint +
        this.endpointSrvc.uploadTopicFilesEndPoint +
        `${data['topic_id']}` +
        '/images',
      data['formData']
    );
  }
  addFavorites(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint +
        this.endpointSrvc.addFavoritesEndPoint +
        `${data['id']}`,
      data
    );
  }
}
