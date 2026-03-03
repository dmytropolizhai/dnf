import { Injectable, inject, computed } from "@angular/core";
import { SolveHistoryService } from "../history/solve-history.service";
import { Solve } from "../types";
import { formatTime } from "@/app/utils";

@Injectable({
    providedIn: "root"
})
export class SolveStatistics {

    private _history = inject(SolveHistoryService);
    private _solves = this._history.solves;

    private isDNF(s: Solve): boolean {
        return s.penalty === 'DNF';
    }

    private isPlus2(s: Solve): boolean {
        return s.penalty === '+2';
    }

    private wcaTime(s: Solve): number {
        if (this.isDNF(s)) return Number.POSITIVE_INFINITY;
        return s.elapsedTime + (this.isPlus2(s) ? 2000 : 0);
    }

    private wcaAverage(n: number): Solve | null {
        const solves = this._solves();
        if (solves.length < n) return null;

        const lastN = solves.slice(-n);
        const dnfCount = lastN.filter(s => this.isDNF(s)).length;

        if (dnfCount >= 2) {
            return {
                elapsedTime: 0,
                penalty: 'DNF',
                date: new Date(),
                scramble: lastN[lastN.length - 1].scramble
            } as Solve;
        }

        const sorted = [...lastN].sort((a, b) => this.wcaTime(a) - this.wcaTime(b));
        const trimmed = sorted.slice(1, -1);
        const sum = trimmed.reduce((acc, s) => acc + this.wcaTime(s), 0);
        const avg = sum / trimmed.length;

        return {
            elapsedTime: avg,
            penalty: 'OK',
            date: new Date(),
            scramble: lastN[lastN.length - 1].scramble,
            formattedTime: formatTime(avg, 'OK')
        } as Solve;
    }

    private filterValidSolves() {
        const solves = this._solves();
        if (solves.length < 2) return null;

        const validSolves = solves.filter(s => !this.isDNF(s));
        if (validSolves.length === 0) return null;

        return validSolves;
    }

    bestSolve = computed(() => {
        const validSolves = this.filterValidSolves();
        if (validSolves === null) return null;

        return validSolves.reduce((a, b) =>
            this.wcaTime(a) <= this.wcaTime(b) ? a : b
        );
    });

    worstSolve = computed(() => {
        const validSolves = this.filterValidSolves();
        if (validSolves === null) return null;

        return validSolves.reduce((a, b) =>
            this.wcaTime(a) >= this.wcaTime(b) ? a : b
        );
    });

    ao5 = computed(() => this.wcaAverage(5));
    ao12 = computed(() => this.wcaAverage(12));
}