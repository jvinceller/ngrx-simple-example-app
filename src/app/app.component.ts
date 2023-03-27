import {Component} from '@angular/core';
import {counterSelector, decrementAction, incrementAction, loadAction, resetAction} from "./app.module";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-root',
  template: `<p>Counter: {{ counter$ | async }}</p>
<button (click)="increment()">Increment</button>
<button (click)="decrement()">Decrement</button>
<button (click)="reset()">Reset</button>
<button (click)="load()">Try loading</button>`
})
export class AppComponent {
  counter$: Observable<number>;

  constructor(private readonly store: Store<any>) {
    this.counter$ = store.select(counterSelector);
  }

  increment() {
    this.store.dispatch(incrementAction());
  }

  decrement() {
    this.store.dispatch(decrementAction());
  }

  reset() {
    this.store.dispatch(resetAction());
  }

  load() {
    this.store.dispatch(loadAction());
  }
}
