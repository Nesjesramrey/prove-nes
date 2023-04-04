import { Injectable } from '@angular/core';
import S3 from 'aws-sdk/clients/s3';
import { Observable, Subject, combineLatest } from 'rxjs';
import { v4 } from 'uuid';

export interface IStreamDataFile {
  key: string; 
  name: string; 
  progress: number; 
  inProgress: boolean; 
  location?: string | null;
}

export interface S3PutObjectRequest extends S3.PutObjectRequest {
  name: string; 
}

@Injectable({ providedIn: 'root' })
export class UploaderService {
  private bucketS3: S3;
  private queueFiles: FileList | null | Array<File> = null;
  private queueObservables: Array<Observable<IStreamDataFile>> = []; 
  private queueSubject: Subject<Array<IStreamDataFile>> = new Subject<Array<IStreamDataFile>>();
  public readonly globalQueueSubject: Observable<Array<IStreamDataFile>> = this.queueSubject.asObservable();

  constructor() {
    this.bucketS3 = new S3({
      accessKeyId: "AKIATHKLAGBD6BFJD6OR",
      secretAccessKey: "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",
      region: 'us-east-1',
    });
  }

  /**
   * Prepare files
   */
  public set stageFiles(fileList: FileList | null | Array<File>) {
    this.queueFiles = fileList; 
  }

  /**
   * @description Star upload files
   */
  public dispatch(): void {
    if(this.queueFiles != null) {      
      for (let index = 0; index < this.queueFiles.length; index++) {  
        const file = this.queueFiles[index];
        const putObjectRequest: S3PutObjectRequest = this.getPutObjectRequest(file);
        const $observable: Observable<IStreamDataFile> = this.getObservablePutObjectRequest(putObjectRequest); 
        this.queueObservables.push($observable);
      }
    }

    combineLatest(this.queueObservables).subscribe({
      next: (streamProgress) => {        
        this.queueSubject.next(streamProgress);
      },
      error: (error) => {
        this.queueSubject.error(error);
      },
      complete: () => {
        this.queueSubject.complete();
      },
    }); 
  }

  /**
   * @description Metadatos para la carga por archivo
   * @param file 
   * @returns 
   */
  private getPutObjectRequest(file: File): S3PutObjectRequest {
    const key = 'temporal/' + v4() + '.' + file.name.split('.').pop();   
    const input: S3PutObjectRequest = {
      name: file.name,
      Bucket: 'static-assets-pando',
      Key: key,
      Body: file,
      ACL: 'public-read',
      ContentType: file.type,
    }
    return input; 
  }

  /**
   * @description Observable de subida de archivo a AWS 
   * @param putObjectRequest 
   * @returns 
   */
  private getObservablePutObjectRequest(putObjectRequest: S3PutObjectRequest): Observable<IStreamDataFile> {
    const $observable = new Observable<IStreamDataFile>((observer) => {         
      this.bucketS3.upload(putObjectRequest)
        .on('httpUploadProgress', function(metadata: S3.ManagedUpload.Progress) {
          const progress = Math.round(metadata.loaded / metadata.total * 100); 
          observer.next({
            key: putObjectRequest.Key,
            name: putObjectRequest.name,
            progress: progress,            
            inProgress: true,
          });      
        }).send(function(error: any, data: S3.ManagedUpload.SendData) {
          if(!error) {
            observer.next({
              key: putObjectRequest.Key,
              name: putObjectRequest.name,
              progress: 100,
              inProgress: false,
              location: data.Location
            });      
            observer.complete();
          } else {
            observer.error(error);
          }
        });
    });   
    return $observable; 
  }
}