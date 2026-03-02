export class ScrambleGenerator {
    private readonly _moves = ["R", "L", "U", "D", "F", "B"];
    private readonly _modifiers = ["", "'", "2"];

    private generateMove(): string {
        return this._moves[Math.floor(Math.random() * this._moves.length)];
    }

    private generateModifier(): string {
        return this._modifiers[Math.floor(Math.random() * this._modifiers.length)];
    }

    private axis(face: string): "x" | "y" | "z" {
        if (face === "R" || face === "L") return "x";
        if (face === "U" || face === "D") return "y";
        return "z"; // F/B
    }

    generate(length: number): string {
        const generatedMoves: string[] = [];

        for (let i = 0; i < length; i++) {
            let move = this.generateMove();
            let modifier = this.generateModifier();
            let fullMove = move + modifier;


            if (generatedMoves.length > 0) {
                const prevFullMove = generatedMoves[generatedMoves.length - 1];
                const prevFace = prevFullMove.slice(0, 1);

                while (prevFullMove === fullMove || this.axis(prevFace) === this.axis(move)) {
                    move = this.generateMove();
                    modifier = this.generateModifier();
                    fullMove = move + modifier;
                }
            }

            generatedMoves.push(fullMove);
        }

        return generatedMoves.join(" ");
    }
}