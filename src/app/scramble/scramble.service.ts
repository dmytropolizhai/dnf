import { computed, Injectable, signal } from "@angular/core";
import { ScrambleGenerator } from "./scramble-generator";
import { Scramble } from "./types";


@Injectable({
    providedIn: "root"
})
export class ScrambleService {
    private readonly _scrambleGenerator = new ScrambleGenerator();

    private _currentScramble = signal<Scramble>('');
    readonly currentScramble = computed(() => this._currentScramble());

    constructor() {
        this.regenerate(20);
    }

    regenerate(length: number): void {
        const newScramble = this._scrambleGenerator.generate(length);

        this._currentScramble.set(newScramble);
    }
}

