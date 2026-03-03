import { Component, inject, input } from "@angular/core";
import { SolveHistoryService } from "./solve-history.service";

@Component({
    selector: 'solve-difference',
    template: `
        @let difference = history.differenceBetweenLastTwoSolves();

        <span 
            [class.positive]="difference < 0"
            [class.negative]="difference > 0"
            class="solve-difference"
        >

            @if (difference) {
                {{ difference < 0 ? ' ' : '+' }}{{ difference.toFixed(3).toString() }}
            }
        </span>
    `,
    styleUrl: './solve-difference.component.css',
    standalone: true,
})
export class SolveDifference {
    protected readonly history = inject(SolveHistoryService);
} 