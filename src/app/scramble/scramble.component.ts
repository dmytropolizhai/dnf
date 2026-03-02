import { Component, inject, input } from "@angular/core";
import { ScrambleService } from "./scramble.service";

@Component({
    selector: "app-scramble",
    template: `
        <section class="scramble">
            {{ scramble.currentScramble() }}
            <button (click)="scramble.generate(length())">&#x27f3;</button>
        </section>
    `,
    styleUrl: "./scramble.component.css"
})
export class ScrambleComponent {
    length = input<number>(20);
    protected scramble = inject(ScrambleService);

    constructor() {
        this.scramble.generate(this.length());
    }
}