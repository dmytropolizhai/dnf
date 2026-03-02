import { Component, inject, input } from "@angular/core";
import { SolveHistoryService } from "./solve-history.service";
import { PenaltySelector } from "../penalty/penalty-selector.component";


/**
 * Component for displaying a single field in the solve history.
 */
@Component({
    selector: "solve-history-field",
    styleUrl: './solve-history.component.css',
    template: `
        <dt class="solve-entry__label">{{ label() }}</dt>
        <dd class="solve-entry__value">
            @if (value()) {
                {{ value() }}
            } @else {
                <ng-content />
            }
        </dd>
    `,
    standalone: true,
})
export class SolveHistoryField {
    label = input.required<string>();
    value = input<string>();
}

/**
 * Component for displaying the title of the solve history.
 */
@Component({
    selector: "solve-history-title",
    template: `
        <h2 id="solve-history-title" class="solve-history__title">
            Solve History
        </h2>
    `,
    styleUrl: './solve-history.component.css',
    standalone: true,
})
export class SolveHistoryTitle {

}

/**
 * Component for displaying the solve history.
 */
@Component({
    selector: 'app-solve-history',
    template: `
        <section class="solve-history" aria-labelledby="solve-history-title">
            <div class="solve-history__header">
                <button class="button-destructive" (click)="history.clear()">Clear</button>
                <solve-history-title />
            </div>

            <ul class="solve-history__list">
                @for (solve of history.solves(); track solve.id) {
                    <li class="solve-history__item">
                        <dl class="solve-entry">
                            <div class="solve-entry__main">
                                <solve-history-field label="Time" [value]="solve.formattedTime" />
                                <solve-history-field class="solve-entry__penalty" label="Penalty">
                                    <solve-penalty-selector [solveId]="solve.id" [currentPenalty]="solve.penalty"/>
                                </solve-history-field>
                            </div>
                            <solve-history-field label="Date" [value]="solve.date.toLocaleString()" />
                            <solve-history-field label="Scramble" [value]="solve.scramble" />
                            <div class="solve-entry__actions">
                                <button (click)="history.deleteSolve(solve.id)">Remove</button>
                            </div>
                        </dl>
                    </li>
                }
            </ul>
        </section>
    `,
    styleUrl: './solve-history.component.css',
    imports: [SolveHistoryField, SolveHistoryTitle, PenaltySelector],
})
export class SolveHistory {
    protected history = inject(SolveHistoryService);
}
