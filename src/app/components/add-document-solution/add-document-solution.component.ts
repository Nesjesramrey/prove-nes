import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SolutionService } from 'src/app/services/solution.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-add-document-solution',
  templateUrl: './add-document-solution.component.html',
  styleUrls: ['./add-document-solution.component.scss'],
})
export class AddDocumentSolutionComponent implements OnInit {
  public imageUrl: string | null = null;
  public addSolutionFormGroup!: FormGroup;
  public submitted = false;
  public file: any = null;

  constructor(
    public dialogRef: MatDialogRef<AddDocumentSolutionComponent>,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public solutionService: SolutionService,
    public utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.addSolutionFormGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
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
    this.file = file;
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onCreateSolution(form: FormGroup) {

    this.submitted = true;
    let data: any = {
      topic: this.dialogData.topicID,
      formData: new FormData(),
    };

    data['formData'].append('title', form['value']['title']);
    data['formData'].append('description', form['value']['description']);
    data['formData'].append('files', this.file);

      console.log('#########333')
    this.solutionService.createNewSolution(data).subscribe({
      error: (error) => {
        this.utilityService.openErrorSnackBar(
          '¡Oops!... Ocurrió un error, inténtalo más tarde.'
        );
        this.submitted = false;
      },
      next: (reply: any) => {
        console.log(reply);
        this.submitted = false;
        this.dialogRef.close({});
      },
      complete: () => {},
    });
  }
}
