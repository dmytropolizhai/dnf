import { computed, inject, Injectable, signal } from "@angular/core";
import { Solve } from "../types";
import { Penalty } from "../penalty";

import { LocalStorageService } from "@/app/local-storage";

const LOCAL_STORAGE_KEY = "solves"

@Injectable({
    providedIn: 'root'
})
export class SolveHistoryService {
    private readonly _localStorage = inject(LocalStorageService);

    private _solves = signal<Solve[]>(this.loadSolves());
    private _nextId = 1;

    solves = this._solves.asReadonly();

    currentSolve = computed(() => this._solves.asReadonly()()[0]);

    /**
     * Loads the solve history from local storage.
     * @returns The solve history.
     */
    loadSolves() {
        console.log("Loading solves from local storage.")
        const solves = this._localStorage.getItem<Solve[]>(LOCAL_STORAGE_KEY);

        return solves ?? [];
    }

    /**
     * Formats the elapsed time in milliseconds to a string representation.
     * @param timeMs The elapsed time in milliseconds.
     * @param penalty The penalty to apply to the elapsed time.
     * @returns The formatted time as a string.
     */
    private formatTime(timeMs: number, penalty: Penalty) {
        if (penalty === "DNF") return "DNF";
        const totalMs = penalty === "+2" ? timeMs + 2000 : timeMs;

        return (totalMs / 1000).toFixed(2);
    }

    /**
     * Adds a new solve to the solve history.
     * @param solve The solve to add to the solve history.
     */
    addSolve(solve: Omit<Solve, 'id' | 'formattedTime'>) {
        console.log(`Adding to solve history: 
            Scramble: ${solve.scramble} 
            Elapsed time: ${solve.elapsedTime}
            Date: ${solve.date}
            Penalty: ${solve.penalty}
        `);

        const newSolve: Solve = {
            id: this._nextId++,
            formattedTime: this.formatTime(solve.elapsedTime, solve.penalty),
            ...solve,
        };

        this._solves.update((solves) => [newSolve, ...solves]);

        this._localStorage.setItem(LOCAL_STORAGE_KEY, this._solves.asReadonly()());
    }

    /**
     * Updates the penalty for the current solve.
     * @param penalty The penalty to apply to the current solve.
     */
    updateSolvePenalty(id: number, penalty: Penalty) {
        this._solves.update(solves =>
            solves.map(solve => solve.id === id
                ? {
                    ...solve,
                    penalty,
                    formattedTime: this.formatTime(solve.elapsedTime, penalty)
                }
                : solve
            )
        )
    }

    /**
     * Deletes a solve from the solve history.
     */
    deleteSolve(id: number) {
        this._solves.update(solves => solves.filter(solve => solve.id !== id));
        this._localStorage.removeItem(id.toString());
    }


    differenceBetweenLastTwoSolves = computed(() => {
        const solves = this._solves.asReadonly()();
        if (solves.length < 2) return 0;

        const lastSolve = solves[0];
        const secondLastSolve = solves[1];

        return (lastSolve.elapsedTime - secondLastSolve.elapsedTime) / 1000;
    });
}