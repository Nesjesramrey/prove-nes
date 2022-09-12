import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class EndPointService {
  public apiEndPoint: string = environment.apiEndPoint;

  // authentication
  public validateEmailEndPoint: string = '/authentication/validate-email';
  public signinEndPoint: string = '/authentication/signin';
  public signupEndPoint: string = '/authentication/singup';
  public signoutEndPoint: string = '/authentication/signout';

  // users
  public fetchFireUserEndPoint: string = '/user/profile';
  public fetchAllUsersEndPoint: string = '/user';
  public addUserPermissionsEndPoint: string = '/user/';
  public uploadAvatarImageEndPoint: string = '/user/';

  // public fetchAllUsersEndPoint: string = '/user/fetch-all-users';
  public fetchUserByIdEndPoint: string = '/user/fetch-user-by-id';
  public fetchUserByFirebaseUIDEndPoint: string = '/user/fetch-user-by-firebase-uid';
  // public addUserPermissionsEndPoint: string = '/user/add-permissions';

  // documents
  public createNewDocumentEndPoint: string = '/document';
  public fetchSingleDocumentByIdEndPoint: string = '/document/';
  public fetchDocumentsByCollaboratorEndPoint: string = '/document/collaborator/';
  public createDocumentLayoutEndPoint: string = '/layout/document/';
  public editDocumentDataEndPoint: string = '/document/';
  public fetchCoverDocumentEndPoint: string = '/document/public/home';
  public setDocumentAsCoverEndPoint: string = '/document/';
  public setDocumentAsPublicPrivateEndPoint: string = '/document/';
  public uploadDocumentFilesEndPoint: string = '/document/';
  public killDocumentImageEndPoint: string = '/document/';

  // public createNewDocumentEndPoint: string = '/document/create-new-document';
  public fetchMyDocumentsEndPoint: string = '/document/fetch-my-documents';
  // public fetchSingleDocumentByngIdEndPoint: string = '/document/fetch-single-document-by-id';
  public fetchEditorDocumentsEndPoint: string = '/document/fetch-editor-documents';
  public addDocumentLayoutEndPoint: string = '/document/add-document-layout';


  public addDocumentCollaboratorEndPoint: string = '/document/add-document-collaborator';
  public addDocumentColumnEndPoint: string = '/document/add-document-column';

  // layouts
  public fetchSingleLayoutByIdEndPoint: string = '/layout/';
  public createNewLayoutOnlyEndPoint: string = '/layout/document/';
  public editLayoutDataEndPoint: string = '/layout/';

  // sub layouts
  public createNewSubLayoutEndPoint: string = '/sublayout/layout/';

  // topics
  public createNewTopicEndPoint: string = '/topic/layout/';
  public fetchSingleTopicByIdEndPoint: string = '/topic/';

  // solutions
  public fetchSingleSolutionByIdEndPoint: string = '/solution/';
  public createNewSolutionEndPoint: string = '/solution/topic/';

  // utility
  public fetchAllStatesEndPoint: string = '/state';
  public createNewCategoryEndPoint: string = '/category';
  public fetchAllCategoriesEndPoint: string = '/category/';
  public fetchAllActivitiesEndPoint: string = '/activity';

  public fetchAllStatesMexEndPoint: string = '/utility/fetch-all-states-mex';
  // public createNewCategoryEndPoint: string = '/utility/create-new-category';
  // public fetchAllCategoriesEndPoint: string = '/utility/fetch-all-categories';

  // uploads
  public uploadUserAvatarEndPoint: string = '/upload/upload-avatar-file';

  // notifications
  public createNewNotificationEndPoint: string = '/notification/create-new-notification';
  public fetchMyNotificationsLengthEndPoint: string = '/notification/fetch-my-notifications-length';
  // public fetchMyNotificationsContentEndPoint: string = '/notification/fetch-my-notifications-content';
  public fetchMyNotificationsContentEndPoint: string = '/notification';

  // support
  public sendSupportMessageEndPoint: string = '/support/init-support-conversation';
  public injectConversationMessageEndPoint: string = '/support/inject-conversation-message';
  public fetchSupportConversationsEndPoint: string = '/support/fetch-support-conversations';
  public killSupportConversationEndPoint: string = '/support/kill-support-conversation';
  public searchConversationsByDateEndPoint: string = '/support/search-conversations-by-date';

  constructor() { }
}
