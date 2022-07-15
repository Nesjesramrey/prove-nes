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
  public fetchUserByIdEndPoint: string = '/user/fetch-user-by-id';

  // documents
  public createNewDocumentEndPoint: string = '/document/create-new-document';
  public fetchMyDocumentsEndPoint: string = '/document/fetch-my-documents';
  public addDocumentCollaboratorEndPoint: string = '/document/add-document-collaborator';
  public addDocumentColumnEndPoint: string = '/document/add-document-column';
  public fetchSingleDocumentByIdEndPoint: string = '/document/fetch-single-document-by-id';

  // utility
  public fetchAllStatesMexEndPoint: string = '/utility/fetch-all-states-mex';

  constructor() { }
}
