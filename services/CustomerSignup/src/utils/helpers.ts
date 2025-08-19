
const toBool = (v: unknown) =>
    typeof v === "string" ? v.toLowerCase() === "true" : Boolean(v);

const toInt = (v: unknown, fallback: number) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

const parseDate = (v: unknown) => {
    const d = new Date(String(v));
    return isNaN(d.getTime()) ? undefined : d;
};


export default {
    toBool,
    toInt,
    parseDate,

}