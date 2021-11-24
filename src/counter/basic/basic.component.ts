import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { interval, NEVER, Subject } from "rxjs";
import { scan, startWith, switchMap, tap } from "rxjs/operators";
import { fromEvent } from 'rxjs'; 
import { map, buffer, filter, debounceTime } from 'rxjs/operators';

@Component({
  selector: "app-basic",
  templateUrl: "./basic.component.html",
  styleUrls: ["./basic.component.css"]
})
export class BasicComponent implements OnInit {
  @ViewChild("counter", { read: ElementRef, static: true })
  counter: ElementRef;

  @ViewChild('wait') buttonWait: ElementRef;


  private counterSubject: Subject<{
    pause?: boolean;
    counterValue?:number;
  }> = new Subject();

  ngOnInit() {
    this.initializeCounter();
  }

  ngAfterViewInit() {

    const waitClick$ =fromEvent(this.buttonWait.nativeElement, 'click')

    const doubleWaitClick$ = waitClick$
    .pipe(
      buffer(waitClick$.pipe(debounceTime(500))),
      map(clicks => clicks.length),
      filter(clicksLength => clicksLength >= 2)
    );

    doubleWaitClick$
    .subscribe(v=> {
      console.log('double clicked detected');
      this.counterSubject.next({ pause: true });
    });
  
  }


  private formatValue(v:number) {
    const minutes = Math.floor(v / 60);
    const formattedMinutes = '' + (minutes > 9 ? minutes : '0' + minutes);
    const seconds = v % 60;
    const formattedSeconds = '' + (seconds > 9 ? seconds : '0' + seconds);
  
    return `${formattedMinutes}:${formattedSeconds}`;
    }



  private initializeCounter() {
    this.counterSubject
      .pipe(
        startWith({ pause: true, counterValue: 0 }),
        scan((acc, val) => ({ ...acc, ...val })),
        tap(state => {
          this.counter.nativeElement.innerText = this.formatValue(state.counterValue);
        }),
        switchMap(state =>
          state.pause
            ? NEVER
            : interval(1000).pipe(
                tap(val => {
                  state.counterValue += 1;
                  this.counter.nativeElement.innerText = this.formatValue(state.counterValue);
                })
              )
        )
      )
      .subscribe();
  }

  startCounter() {
    this.counterSubject.next({ pause: false });
  }

  resetCounter() {
    this.counterSubject.next({ counterValue: 0});
  }

}
