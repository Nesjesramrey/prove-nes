import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { EndPointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  public accessToken: any = null;

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  addFavorites(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.addFavoritesEndPoint, data
    );
  }

  updateFavorites(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.updateFavoritesEndPoint, data
    );
  }

  fetchFavoritesBylayoutID(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchFavoritesFromlayoutEndPoint + data['_id']
    );
  }

  fetchFavoritesByTopicID(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchFavoritesFromTopicEndPoint + data['_id']
    );
  }

  fetchFavoritesBySolutionID(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchFavoritesFromSolutionEndPoint + data['_id']
    );
  }
}
