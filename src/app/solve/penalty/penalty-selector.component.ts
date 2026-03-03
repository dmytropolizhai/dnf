import { Component, inject, input } from "@angular/core";
import { Penalty } from "./types";
import { SolveHistoryService } from "../history/solve-history.service";

@Component({
    selector: "solve-penalty-selector",
    template: `
        <select class="primary-container" [value]="currentPenalty()" (change)="onPenaltyChange($event)">
            <option value="OK">OK</option>
            <option value="+2">+2</option>
            <option value="DNF">DNF</option>
        </select>
    `,
})
export class PenaltySelector {
    private readonly _historyService = inject(SolveHistoryService);

    solveId = input.required<number>();
    currentPenalty = input<Penalty>();

    onPenaltyChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        const newPenalty = target.value as Penalty;

        this._historyService.updateSolve(this.solveId(), {
            penalty: newPenalty
        });
    }
}
