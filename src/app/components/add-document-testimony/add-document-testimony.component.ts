import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddDocumentThemeComponent } from '../add-document-theme/add-document-theme.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestimonyService } from 'src/app/services/testimony.service';

@Component({
  selector: 'app-add-document-testimony',
  templateUrl: './add-document-testimony.component.html',
  styleUrls: ['./add-document-testimony.component.scss'],
})
export class AddDocumentTestimonyComponent implements OnInit {
  public addTestimonyFormGroup!: FormGroup;
  public imageUrl: string | null = null;
  public submitted = false;
  public file: any = null;
  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDocumentThemeComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public testimonyService: TestimonyService
  ) {}

  killDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.addTestimonyFormGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
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

  createTestimony(formGroup: FormGroup) {
    this.submitted = true;

    const { name, description } = formGroup.value;
    const { topicID, type } = this.dialogData;
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('files', this.file);

    const data = {
      form: formData,
      id: topicID,
      type: type,
    };

    this.testimonyService.createNewTestimony(data).subscribe((reply: any) => {
      this.submitted = false;
      this.dialogRef.close(reply);
    });
  }
}
