//
export const convertToISO = (val) => {
    if (!val || typeof val !== "string") return "";

    // Assuming the input format is "MM/DD/YYYY"
    const [month, day, year] = val.split("/");

    // Assuming the input format is "DD/MM/YYYY"
    // const [day, month, year] = val.split("/");
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return val && !isNaN(date) ? date.toISOString().slice(0, 10) : "";
}
