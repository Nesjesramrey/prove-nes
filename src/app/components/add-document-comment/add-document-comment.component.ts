import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddDocumentThemeComponent } from '../add-document-theme/add-document-theme.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-add-document-comment',
  templateUrl: './add-document-comment.component.html',
  styleUrls: ['./add-document-comment.component.scss'],
})
export class AddDocumentCommentComponent implements OnInit {
  public addCommentFormGroup!: FormGroup;
  public imageUrl: string | null = null;
  public submitted = false;
  public file: any = null;
  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDocumentCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public commentService: CommentService
  ) { 
    // console.log(this.dialogData);
  }

  killDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.addCommentFormGroup = this.formBuilder.group({
      description: ['', [Validators.required]],
      image: ['', []],
    });
  }

  handleSelectImage(event: any) {
    if (event == null) return;

    const file = (event.target as HTMLInputElement)?.files![0];
    this.file = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  createComment(formGroup: FormGroup) {
    this.submitted = true;

    const { description } = formGroup.value;
    const { relationID, type } = this.dialogData;

    // const formData = new FormData();
    // formData.append('description', description);
    // formData.append('files', this.file);

    const data = {
      // form: formData,
      id: relationID,
      type: type,
      data: { description },
    };

    this.commentService.createNewComment(data).subscribe((reply: any) => {
      this.submitted = false;
      this.dialogRef.close(reply);
    });
  }
}
