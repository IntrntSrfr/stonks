/**
 * This is GPT.
 * @param num 
 * @returns a human readable string version of num
 */
export const numberToHumanReadable = (num: number): string => {
    if (Math.abs(num) < 1000) return num.toString();

    const units = ['K', 'M', 'B', 'T'];

    let unitIndex = -1;
    let divisionValue = 1;
    while (Math.abs(num) / divisionValue >= 1_000 && unitIndex < units.length - 1) {
        unitIndex++;
        divisionValue *= 1_000;
    }

    return parseFloat((num / divisionValue).toFixed(2)) + units[unitIndex];
}

export const subtractDate = (days: number = 0, months: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setMonth(date.getMonth() - months);
    return date;
};
