import { Injectable } from '@angular/core';
import S3 from 'aws-sdk/clients/s3';
import { BehaviorSubject, Observable, ObservableInput, Subject, combineLatest, concatMap, switchMap, tap } from 'rxjs';
import { v4 } from 'uuid';

export interface IQueue {
  id: number; 
  files:  FileList | Array<File>;
}

@Injectable({ providedIn: 'root' })
export class QueueService<T> {
  private queue: BehaviorSubject<Subject<ObservableInput<T>>>;

  constructor() { 
    this.queue = new BehaviorSubject<Subject<ObservableInput<T>>>(new Subject<ObservableInput<T>>())
  }

  /**
   * @description 
   */
  public enqueue(item: ObservableInput<T>, files?: FileList | Array<File>): void {
    this.queue.value.next(item);


    // let _streamProgress: IStreamDataFile[] = []; 
    // combineLatest(queueObservables).subscribe({
    //   next: (streamProgress) => {        
    //     _streamProgress = streamProgress;
    //     this.queueSubject.next(_streamProgress);
    //   },
    //   error: (error) => {
    //     this.queueSubject.error(error);
    //   },
    //   complete: () => {        
    //     this.queueSubject.complete();
    //   },
    // }); 
  }

  public asObservable(): Observable<T> {
    return this.queue.asObservable().pipe(
      tap(queue => console.log("::", queue)),
      switchMap(queue => {

        return queue.pipe(
          concatMap(item => item)
        );
      })
    ); 
  }
}