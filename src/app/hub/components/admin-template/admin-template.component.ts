import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDocumentDialogComponent } from 'src/app/components/add-document-dialog/add-document-dialog.component';
import { UtilityService } from 'src/app/services/utility.service';
import { CommentService } from 'src/app/services/comment.service';
import { DocumentService } from 'src/app/services/document.service';
import { ComponentsModule } from 'src/app/components/components.module';


@Component({
  selector: '.admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.scss']
})
export class AdminTemplateComponent implements OnInit {
  @Input('user') public user: any = null;
  @Input('documents') public documents: any = [];
  public isDataAvailable: boolean = false;
  public selectedDocument: any = null;
  public commentUsers : any[] = [];
  public documentSelectId : string = '';

  constructor(
    public dialog: MatDialog,
    public utilityService: UtilityService,
    public commentService  : CommentService,
    public documentService : DocumentService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.setDocumentEditor();
      this.isDataAvailable = true;
    });
    this.returnComment();
  }

  setDocumentEditor() {
    this.documents.filter((x: any) => {
      let editors: any = [];
      x['collaborators'].filter((c: any) => {
        if (c['activity']['value'] == 'editor') {
          editors.push(c);
        }
      });
      x['editors'] = editors;
    });
  }

  openAddDocumentDialog() {
    const dialogRef = this.dialog.open(AddDocumentDialogComponent, {
      width: '640px',
      data: {
        created_by: this.user['_id']
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.documents.unshift(reply);
        this.setDocumentEditor();
      }
    });
  }

  displayDocumentData(documentID: string) {
    return;
    let document: any = this.documents.filter((doc: any) => { return doc['_id'] == documentID; });
    this.selectedDocument = null;
    this.selectedDocument = document[0];
    // console.log(this.selectedDocument);
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }


  selectDocument(document:any){
   this.documentSelectId = document._id;
   this.returnComments(document);
  }

  returnComment(){
    const comentarios = [
      {
        user : 'jose alfaro',
        img  : 'https://us.123rf.com/450wm/koblizeek/koblizeek2001/koblizeek200100050/138262629-usuario-miembro-de-perfil-de-icono-de-hombre-vector-de-s%C3%ADmbolo-perconal-sobre-fondo-blanco-aislado-.jpg?ver=6' ,
        comment: ' texto de prueba'
      },
      {
        user : 'test alfaro',
        img  : 'https://us.123rf.com/450wm/koblizeek/koblizeek2001/koblizeek200100050/138262629-usuario-miembro-de-perfil-de-icono-de-hombre-vector-de-s%C3%ADmbolo-perconal-sobre-fondo-blanco-aislado-.jpg?ver=6' ,
        comment: ' texto de prueba 2'
      },
      {
        user : 'test alfaro',
        img  : 'https://us.123rf.com/450wm/koblizeek/koblizeek2001/koblizeek200100050/138262629-usuario-miembro-de-perfil-de-icono-de-hombre-vector-de-s%C3%ADmbolo-perconal-sobre-fondo-blanco-aislado-.jpg?ver=6' ,
        comment: ' texto de prueba 2'
      },
      {
        user : 'test alfaro',
        img  : 'https://us.123rf.com/450wm/koblizeek/koblizeek2001/koblizeek200100050/138262629-usuario-miembro-de-perfil-de-icono-de-hombre-vector-de-s%C3%ADmbolo-perconal-sobre-fondo-blanco-aislado-.jpg?ver=6' ,
        comment: ' texto de prueba 2'
      },
       {
        user : 'test alfaro',
        img  : 'https://us.123rf.com/450wm/koblizeek/koblizeek2001/koblizeek200100050/138262629-usuario-miembro-de-perfil-de-icono-de-hombre-vector-de-s%C3%ADmbolo-perconal-sobre-fondo-blanco-aislado-.jpg?ver=6' ,
        comment: ' texto de prueba 2'
      }
    ];

    /* this.commentUsers = comentarios; */
  }


  returnComments(document:any){
    const data = {
      documentId : document._id,
      layouts : document.layouts 
    }
    this.commentService.finRelationIdComment(data).subscribe((data:any)=> {
      let comments : any[] = [];
      data.forEach( (element :any ) => {
      comments.push(element);
      })
      this.commentUsers = comments;
    })
  }

}
