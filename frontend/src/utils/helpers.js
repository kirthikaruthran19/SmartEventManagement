export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
};