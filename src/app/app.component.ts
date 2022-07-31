import { Component } from "@angular/core";
import * as moment from "moment";
import { fromEvent, interval} from "rxjs";
import { buffer, filter, map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  timer: any;
  seconds: number = 0;

  isEnable: boolean = false;
  display: number = 0;
  ngAfterViewInit() {
    fromEvent(document, "click")
      .pipe(
        buffer(interval(500)),
        filter((clicks) => clicks.length === 2)
      )
      .subscribe(() => {
        this.timer.unsubscribe();
        this.isEnable = false;
      });
  }

  ngOnDestroy() {
    this.timer.unsubscribe();
  }

  handleStart() {
    this.isEnable = true;
    this.timer = interval(1000)
      .pipe(
        map(() => {
          this.seconds++;
        })
      )
      .subscribe(() => (this.display = this.seconds));
  }

  handleStop() {
    if (this.timer) {
      this.resetCounter();
      this.timer.unsubscribe();
      this.isEnable = false;
    }
  }

  resetCounter() {
    this.display = 0;
    this.seconds = 0;
  }

  handleReset() {

    this.timer.unsubscribe();
    this.resetCounter();
    this.handleStart();
  }

  formatTime(value: number): string {
    return moment().startOf("day").seconds(value).format("mm:ss");
  }
}
