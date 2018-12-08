"use strict";
const { combineLatest, merge, Subject, of } = require("rxjs");
const {
  map,
  distinctUntilChanged,
  groupBy,
  filter,
  first,
  tap,
  mergeMap,
  throttleTime,
  scan, //reduce-like
} = require("rxjs/operators");

let timeframeSrc = new Subject();

timeframeSrc
  .pipe(
    mergeMap(analyticsNew),
    //map(analyticsOld)
    filter(x => x % 2)
  )
  .subscribe(x => console.log(x));

function analyticsOld(data) {
  return data[0];
}

function analyticsNew(data) {
  return of(...data);
}

timeframeSrc.next([1, 2, 3]);
timeframeSrc.next([4, 5, 6]);
timeframeSrc.next([7, 8, 9]);
