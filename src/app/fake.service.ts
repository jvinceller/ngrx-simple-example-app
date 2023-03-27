import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

interface FakeServiceData {
  data1: number;
  data2: string;
}

@Injectable({
  providedIn: 'root'
})
export class FakeService {

  getData(): Observable<FakeServiceData> {
    // Simulating loading data and failing every other time
    return new Observable<FakeServiceData>(subscriber => {
      if (Math.random() > 0.5) {
        setTimeout(() => {
          subscriber.next({data1: 100, data2: 'text'});
          subscriber.complete();
        }, 2000);
      } else {
        setTimeout(() => {
          subscriber.error('Oops!');
        }, 500);
      }
    })
  }
}
