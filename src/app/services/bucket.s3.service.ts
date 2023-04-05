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
export class BucketS3Service {
  private bucketS3: S3;
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
   * @description 
   */
  public stage(fileList: FileList | Array<File>): Array<Observable<IStreamDataFile>> {
    let queueObservables: Array<Observable<IStreamDataFile>> = [];
    for (let index = 0; index < fileList.length; index++) {  
      const file = fileList[index];
      const putObjectRequest: S3PutObjectRequest = this.getPutObjectRequest(file);
      const $observable: Observable<IStreamDataFile> = this.createObservablePutObjectRequest(putObjectRequest); 
      queueObservables.push($observable);
    }
    return queueObservables;
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
  private createObservablePutObjectRequest(putObjectRequest: S3PutObjectRequest): Observable<IStreamDataFile> {
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