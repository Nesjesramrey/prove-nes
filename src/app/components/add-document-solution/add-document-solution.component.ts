import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-document-solution',
  templateUrl: './add-document-solution.component.html',
  styleUrls: ['./add-document-solution.component.scss'],
})
export class AddDocumentSolutionComponent implements OnInit {
  public imageUrl: string | null = null;
  public addSolutionFormGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddDocumentSolutionComponent>,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addSolutionFormGroup = this.formBuilder.group({
      description: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });
  }

  killDialog() {
    this.dialogRef.close();
  }

  handleSelectImage(event: any) {
    if (event == null) return;

    const file = (event.target as HTMLInputElement)?.files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
