export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "COP"
    }).format(price);
};