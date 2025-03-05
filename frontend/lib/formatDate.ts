export function formatDate(dateInput: Date | string | null | undefined) {
    if (!dateInput) return "Fecha inválida";

    let date: Date;
    if (typeof dateInput === "string") {
        date = new Date(dateInput);
    } else {
        date = dateInput;
    }

    if (isNaN(date.getTime())) return "Fecha inválida";

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}
