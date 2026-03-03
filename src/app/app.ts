import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SolveHistory, SolveHistoryService, SolveDifference } from './solve/history';
import { ScrambleComponent, ScrambleService } from "./scramble";
import { StopwatchService, StopwatchComponent } from './stopwatch';
import { SolveStatisticsComponent } from "./solve/statistics";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StopwatchComponent, SolveHistory, ScrambleComponent, SolveStatisticsComponent, SolveDifference],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('DNF');

  private readonly _stopwatchService = inject(StopwatchService);
  private readonly _scrambleService = inject(ScrambleService);
  private readonly _solveHistoryService = inject(SolveHistoryService);

  constructor() {
    this._stopwatchService.onFinish.subscribe(() => {
      const scramble = this._scrambleService.currentScramble();
      const elapsedTime = this._stopwatchService.elapsedTime();
      const today = new Date();


      this._solveHistoryService.addSolve({
        date: today,
        penalty: "OK",
        scramble: scramble,
        elapsedTime: elapsedTime,
      })

    });
  }

}
