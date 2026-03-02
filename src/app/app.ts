import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SolveHistory, SolveHistoryService, SolveDifference } from './solve/history';
import { ScrambleComponent, ScrambleService } from "./scramble";
import { StopwatchService, StopwatchComponent } from './stopwatch';
import { SolveStatisticsComponent } from "./solve/statistics";
import { PenaltyService } from './solve/penalty';

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
  private readonly _penaltyService = inject(PenaltyService);

  constructor() {
    this._stopwatchService.onFinish.subscribe(() => {
      const scramble = this._scrambleService.currentScramble();
      const elapsedTime = this._stopwatchService.elapsedTime();
      const penalty = this._penaltyService.penalty();
      const today = new Date();


      this._solveHistoryService.addSolve({
        date: today,
        penalty: penalty,
        scramble: scramble,
        elapsedTime: elapsedTime,
      })

    });
  }

}
