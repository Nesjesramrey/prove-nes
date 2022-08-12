import { Injectable } from "@angular/core";

@Injectable()
export class EndPointService {
  public apiEndPoint: string = 'http://localhost:4040';

  // authentication
  public validateEmailEndPoint: string = '/authentication/validate-email';
  public signinEndPoint: string = '/authentication/signin';
  public signupEndPoint: string = '/authentication/signup';
  public signoutEndPoint: string = '/authentication/signout';

  // users
  public fetchAllUsersEndPoint: string = '/user/fetch-all-users';
  public fetchUserByIdEndPoint: string = '/user/fetch-user-by-id';
  public addUserPermissionsEndPoint: string = '/user/add-permissions';

  // documents
  public createNewDocumentEndPoint: string = '/document/create-new-document';
  public fetchMyDocumentsEndPoint: string = '/document/fetch-my-documents';
  public fetchSingleDocumentByIdEndPoint: string = '/document/fetch-single-document-by-id';
  public fetchEditorDocumentsEndPoint: string = '/document/fetch-editor-documents';
  public addDocumentLayoutEndPoint: string = '/document/add-document-layout';


  public addDocumentCollaboratorEndPoint: string = '/document/add-document-collaborator';
  public addDocumentColumnEndPoint: string = '/document/add-document-column';

  // utility
  public fetchAllStatesMexEndPoint: string = '/utility/fetch-all-states-mex';
  public createNewCategoryEndPoint: string = '/utility/create-new-category';
  public fetchAllCategoriesEndPoint: string = '/utility/fetch-all-categories';

  // uploads
  public uploadUserAvatarEndPoint: string = '/upload/upload-avatar-file';

  // notifications
  public createNewNotificationEndPoint: string = '/notification/create-new-notification';
  public fetchMyNotificationsLengthEndPoint: string = '/notification/fetch-my-notifications-length';
  public fetchMyNotificationsContentEndPoint: string = '/notification/fetch-my-notifications-content';

  // support
  public sendSupportMessageEndPoint: string = '/support/init-support-conversation';
  public injectConversationMessageEndPoint: string = '/support/inject-conversation-message';
  public fetchSupportConversationsEndPoint: string = '/support/fetch-support-conversations';
  public killSupportConversationEndPoint: string = '/support/kill-support-conversation';
  public searchConversationsByDateEndPoint: string = '/support/search-conversations-by-date';

  constructor() { }
}
