import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class EndPointService {
  public apiEndPoint: string = environment.apiEndPoint;

  // authentication
  public passwordRecoveryEndPoint: string = '/authentication/password_recovery';
  public validateEmailEndPoint: string = '/authentication/validate-email';
  public signinEndPoint: string = '/authentication/signin';
  public signupEndPoint: string = '/authentication/singup';
  public signoutEndPoint: string = '/authentication/signout';

  // users
  public fetchFireUserEndPoint: string = '/user/profile';
  public fetchAllUsersEndPoint: string = '/user';
  public addUserPermissionsEndPoint: string = '/user/';
  public uploadAvatarImageEndPoint: string = '/user/';
  // public fetchUserByIdEndPoint: string = '/user/fetch-user-by-id';
  public fetchUserByIdEndPoint: string = '/user/';
  public fetchUserByFirebaseUIDEndPoint: string = '/user/fetch-user-by-firebase-uid';
  public saveLayoutsCategoryPreferenceEndPoint: string = '/user/';
  public addAssociationEndPoint: string = '/user/';
  public fetchUserCountEndPoint: string = '/user/count';
  public joinUserWithAssociationEndPoint: string = '/user/'
  public searchUserByEmailEndPoint: string = '/user';
  public uploadUserIDDocumentEndPoint: string = '/user/';
  public searchInUserListEndPoint: string = '/user/search';

  // documents
  public createNewDocumentEndPoint: string = '/document';
  // public fetchSingleDocumentByIdEndPoint: string = '/yoorco-dev/document/';
  public fetchSingleDocumentByIdEndPoint: string = '/document/';
  public fetchDocumentsByCollaboratorEndPoint: string = '/document/collaborator/';
  public createDocumentLayoutEndPoint: string = '/layout/document/';
  public editDocumentDataEndPoint: string = '/document/';
  public fetchCoverDocumentEndPoint: string = '/document/public/home';
  public setDocumentAsCoverEndPoint: string = '/document/';
  public setDocumentAsPublicPrivateEndPoint: string = '/document/';
  public uploadDocumentFilesEndPoint: string = '/document/';
  public killDocumentImageEndPoint: string = '/document/';
  public fetchMyDocumentsEndPoint: string = '/document/fetch-my-documents';
  public fetchEditorDocumentsEndPoint: string = '/document/fetch-editor-documents';
  public addDocumentLayoutEndPoint: string = '/document/add-document-layout';
  public addDocumentCollaboratorEndPoint: string = '/document/add-document-collaborator';
  public addDocumentColumnEndPoint: string = '/document/add-document-column';
  public fetchAccessControlListEndPoint: string = '/access_control_list';

  // layouts
  public fetchSingleLayoutByIdEndPoint: string = '/layout/';
  public createNewLayoutOnlyEndPoint: string = '/layout/document/';
  public editLayoutDataEndPoint: string = '/layout/';
  public uploadLayoutFilesEndPoint: string = '/layout/';
  public killLayoutImageEndPoint: string = '/layout/';
  public addLayoutCollaboratorEndPoint: string = '/layout/collaborators';
  public getTopLayoutByDocumentEndPoint: string = '/layout/top/document/';
  public getTopSublayoutByLayoutEndPoint: string = '/layout/top/layout/';

  // sub layouts
  public createNewSubLayoutEndPoint: string = '/sublayout/layout/';

  // topics
  public fetchSuggestionTopicByUser: string = '/topic/suggestion/by_user/';
  public fetchSingleTopicByIdEndPoint: string = '/topic/';
  public createNewTopicEndPoint: string = '/topic/layout/';
  public uploadTopicFilesEndPoint: string = '/topic/';
  public updateTopicDataEndPoint: string = '/topic/';
  public fetchFavoriteTopicsByUserEndPoint: string = '/topic/user/';
  public fetchVotedTopicsByUserEndPoint: string = '/topic/user/';
  public killTopicEndPoint: string = '/topic/';
  public moveTopicEndPoint: string = '/topic/move';
  public copyTopicEndPoint: string = '/topic/copy';

  // permission
  public createNewPermissionEndPoint: string = '/permission/';

  // solutions
  public fetchTopSolution: string = '/solution/top';
  public fetchSingleSolutionByIdEndPoint: string = '/solution/';
  public createNewSolutionEndPoint: string = '/solution/topic/';
  public getTopSolutionByDocumentEndPoint: string = '/solution/document/';
  public getTopSolutionByLayoutEndPoint: string = '/solution/layout/';
  public updateSolutionDataEndPoint: string = '/solution/';
  public uploadSolutionFilesEndPoint: string = '/solution/';
  public killSolutionEndPoint: string = '/solution/';

  // utility
  public fetchAllStatesEndPoint: string = '/state';
  public createNewCategoryEndPoint: string = '/category';
  public fetchAllCategoriesEndPoint: string = '/category/';
  public fetchAllActivitiesEndPoint: string = '/activity';
  public fetchAssociationTypologyEndPoint: string = '/association_typology';
  public fetchAllStatesMexEndPoint: string = '/utility/fetch-all-states-mex';
  public inviteUserToMexicolectivoEndPoint: string = '/package/invite/email';
  public searchCollegeEndPoint: string = '/university/search';
  public shareLinkByEmailEndPoint: string = '/package/share/email';

  // uploads
  public uploadUserAvatarEndPoint: string = '/upload/upload-avatar-file';

  // notifications
  public createNewNotificationEndPoint: string = '/notification/create-new-notification';
  public fetchMyNotificationsLengthEndPoint: string = '/notification/fetch-my-notifications-length';
  public fetchMyNotificationsContentEndPoint: string = '/notification';
  public fetchMyNotificationUnreadEndPoint: string = '/notification/number_of_unread/user/';
  public markAsReadNotificationEndPoint: string = '/notification/';
  public killNotificationEndPoint: string = '/notification/';

  // support
  public sendSupportMessageEndPoint: string = '/support/init-support-conversation';
  public injectConversationMessageEndPoint: string = '/support/inject-conversation-message';
  public fetchSupportConversationsEndPoint: string = '/support/fetch-support-conversations';
  public killSupportConversationEndPoint: string = '/support/kill-support-conversation';
  public searchConversationsByDateEndPoint: string = '/support/search-conversations-by-date';

  // testimony
  public fetchSingleTestimonyByIdEndPoint: string = '/testimony/';
  public createNewTestimonyEndPoint: string = '/testimony/';
  public fetchAllTestimoniesEndPoint: string = '/testimony';
  public killTestimonyEndPoint: string = '/testimony/';
  public fetchTopicTestimoniesEndPoint: string = '/testimony';

  // comment
  public fetchSingleCommentByIdEndPoint: string = '/comment/';
  public createNewCommentEndPoint: string = '/comment/';
  public findRelationIdEndPoint: string = '/comment/document';
  public createNewDocumentCommentEndPoint: string = '/comment/document/';
  public fetchDocumentCommentsEndPoint: string = '/comment/document/';
  public createNewLayoutCommentEndPoint: string = '/comment/document/';
  public createNewSubLayoutCommentEndPoint: string = '/comment/document/';
  public fetchLayoutCommentsEndPoint: string = '/comment/document/';
  public createNewTopicCommentEndPoint: string = '/comment/document/';
  public fetchTopicCommentsEndPoint: string = '/comment/document/';
  public createNewSolutionCommentEndPoint: string = '/comment/document/';
  public fetchSolutionCommentsEndPoint: string = '/comment/document/';
  public fetchCommentByIdEndPoint: string = '/comment/';
  public killDocumentCommentEndPoint: string = '/comment/';
  public replyDocumentCommentsEndPoint: string = '/comment/';

  // vote
  public createNewVoteEndPonint: string = '/vote/';
  public deleteVoteEndPonint: string = '/vote/';
  public fetchVotesFromTopicEndPonint: string = '/vote/topic/';
  public fetchVotesFromSolutionEndPonint: string = '/vote/solution/';

  // favorites
  public addFavoritesEndPoint: string = '/favorites/';
  public deleteFavoritesEndPoint: string = '/favorites/';
  public updateFavoritesEndPoint: string = '/favorites/';
  public fetchFavoritesFromlayoutEndPoint: string = '/favorites/layout/';
  public fetchFavoritesFromTopicEndPoint: string = '/favorites/topic/';
  public fetchFavoritesFromSolutionEndPoint: string = '/favorites/solution/';

  // visit
  public sendVisitEndPoint: string = '/visit/';

  // socket
  public updateSocketIDEndPoint: string = '/user/';

  // categories
  public editCategoryEndPoint: string = '/category/';

  // search
  public globalSearchEndPoint: string = '/document/search_content';

  // permissions
  public requestAccessPermissionEndPoint: string = '/permission';
  public markPermissionAsAttendedEndPoint: string = '/permission/';
  public fetchPermissionByIdEndPoint: string = '/permission/';

  // complaint
  public fileComplaintEndPoint: string = '/complaint';
  public fetchAllComplaintsEndPoint: string = '/complaint';
  public fetchComplaintByIdEndPoint: string = '/complaint/';
  public killComplaintEndPoint: string = '/complaint/';
  public attendComplaintEndPoint: string = '/complaint/';

  //association
  public createAssociationEndpoint: string = '/association';
  public fetchAssociationByIdEndPoint: string = '/association/';
  public searchAssociationEndpoint: string = '/association?name=';
  public authorizationAssociationEndpoint: string = '/association/';
  public uploadAvatarAssociationImageEndPoint: string = '/association/';

  // posts
  public fetchAllPostsEndPoint: string = '/post';
  public fetchPostByRelationIdEndPoint: string = '/post/';
  public addPostCommentEndPoint: string = '/post/';
  public categorizePostEndPoint: string = '/assignment';
  public filterPostsEndPoint: string = '/post/search';

  // teams
  public createTeamEndPoint: string = '/team';
  public leaderStatusEndPoint: string = '/team/validate_user_lead/';
  public assignTeamCollaboratorsEndPoint: string = '/team/assign_collaborators/';
  public setTeamCategoriesEndPoint: string = '/team/assign_layout/';
  public fetchTeamByIdEndPoint: string = '/team/';
  public assignTeamTopicEndPoint: string = '/team/assign_topic/';
  public uploadCoverImageEndPoint: string = '/team/';
  public uploadTeamAvatarEndPoint: string = '/team/';
  public killTeamCollaboratorEndPoint: string = '/team/remove_collaborators/';
  public upoloadProposalEndPoint: string = '/team/';
  public fetchAllTeamsEndPoint: string = '/team';
  public searchTeamsModuleEndPoint: string = '/team/search';
  public killTeamEndPoint: string = '/team/';

  constructor() { }
}
