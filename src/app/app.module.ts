import {inject, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {createAction, createReducer, createSelector, on, props, StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {Actions, createEffect, EffectsModule, ofType} from "@ngrx/effects";
import {FakeService} from "./fake.service";
import {catchError, exhaustMap, map, of} from "rxjs";

interface MyStoreState {
  featureState: MyFeatureState;
}

interface MyFeatureState {
  counter: number;
}

const initialState: MyFeatureState = {
  counter: 0
};

export const incrementAction = createAction('[MyFeature] Increment');
export const decrementAction = createAction('[MyFeature] Decrement');
export const resetAction = createAction('[MyFeature] Reset');
export const loadAction = createAction('[MyFeature] Load');
export const loadedAction = createAction('[MyFeature] Loaded', props<{ data: number }>());
export const loadFailureAction = createAction('[MyFeature] Loading failed', props<{ errorMsg: string }>());

export const statusReducer = createReducer(
  initialState,
  on(incrementAction, featureState => ({...featureState, counter: featureState.counter + 1})),
  on(decrementAction, featureState => ({...featureState, counter: featureState.counter - 1})),
  on(resetAction, featureState => ({...featureState, counter: 0})),
  on(loadedAction, (featureState, {data}) => ({...featureState, counter: data})),
  on(loadFailureAction, featureState => ({...featureState, counter: 10}))
);

export const loadEffect = createEffect(
  (actions$ = inject(Actions), fakeService = inject(FakeService)) => {
    return actions$.pipe(
      ofType(loadAction),
      exhaustMap(() =>
        fakeService.getData().pipe(
          map((data) => loadedAction({data: data.data1})),
          catchError((error: { message: string }) =>
            of(loadFailureAction({errorMsg: error.message}))
          )
        )
      )
    );
  },
  {functional: true}
);

export const selectFeature = (state: MyStoreState) => state.featureState;
export const selectFeatureCounter = (state: MyFeatureState) => state.counter;

export const counterSelector = createSelector(selectFeature, selectFeatureCounter);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({
      featureState: statusReducer
    }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot({
      loadEffect
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
