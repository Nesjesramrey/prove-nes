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
  ) { }

  createNewTopic(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewTopicEndPoint + `${data['layout_id']}`, data['formData']
    );
  }

  fetchSingleTopicById(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSingleTopicByIdEndPoint + `${data['_id']}`
    );
  }

  uploadTopicFiles(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.uploadTopicFilesEndPoint + `${data['topic_id']}` + '/images', data['formData']
    );
  }

  updateTopicData(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.updateTopicDataEndPoint + `${data['topic_id']}`, data
    );
  }

  fetchSuggestionTopic() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSuggestionTopicByUser
    );
  }

  fetchFavoriteTopicsByUser(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchFavoriteTopicsByUserEndPoint + data['userID'] + '/favorites'
    );
  }

  fetchVotedTopicsByUser(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchVotedTopicsByUserEndPoint + data['userID'] + '/voted'
    );
  }

  killTopic(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.killTopicEndPoint + `${data['topic_id']}`, data
    );
  }

  moveTopic(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.moveTopicEndPoint, data
    );
  }
}
