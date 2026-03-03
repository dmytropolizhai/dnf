import { Penalty } from "./solve/penalty/types";

/**
 * Formats the elapsed time in milliseconds to a string representation.
 * @param timeMs The elapsed time in milliseconds.
 * @param penalty The penalty to apply to the elapsed time.
 * @returns The formatted time as a string.
 */
export function formatTime(timeMs: number, penalty: Penalty) {
    if (penalty === "DNF") return "DNF";
    const totalMs = penalty === "+2" ? timeMs + 2000 : timeMs;

    return (totalMs / 1000).toFixed(2);
}
