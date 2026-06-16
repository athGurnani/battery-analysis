export function encodeBatteryHealth(
    resistance: number,
    avgTemp: number
) {
    const score =
        100 -
        resistance * 5 -
        Math.max(0, avgTemp - 35);

    return Math.max(0, Math.round(score));
}