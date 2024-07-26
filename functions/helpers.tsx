function cutAddress(input: string, beforeDots: number, afterDots: number): string {
    if (!input || input.length <= beforeDots + afterDots) {
        return input;
    }

    const prefix = input.slice(0, beforeDots);
    const suffix = input.slice(-afterDots);
    const middleDots = '...';

    return `${prefix}${middleDots}${suffix}`;
}

function cutString(input: string, maxLength: number): string {
    if (!input || input.length <= maxLength) {
        return input;
    }

    return input.slice(0, maxLength) + '...';
}


function formatDateTime(date: string | number | Date) {
    if (date) {
        const dt = new Date(date);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        const month = monthNames[dt.getMonth()];
        const year = dt.getFullYear();
        const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
        const minutes = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
        const seconds = dt.getSeconds() < 10 ? '0' + dt.getSeconds() : dt.getSeconds();
        const timezoneOffset = -dt.getTimezoneOffset();
        const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
        const offsetMinutes = Math.abs(timezoneOffset % 60);
        const timezone = "UTC" + (timezoneOffset >= 0 ? "+" : "-") + 
                         (offsetHours < 10 ? '0' + offsetHours : offsetHours) + ":" + 
                         (offsetMinutes < 10 ? '0' + offsetMinutes : offsetMinutes);

        return `${month} ${day}, ${year}, ${hours}:${minutes}:${seconds} (${timezone})`;
    }
    return '';
};

function formatBalance(n: number) {
    if (n < 1e3) {
        return n.toFixed(3);
    }
    if (n >= 1e3 && n < 1e9) {
        return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (n >= 1e9 && n < 1e12) {
        return '≈' + (n / 1e9).toFixed(1) + 'B';
    }
};
function formatValue(n: any) {
    if (n < 1e3) {
        return n;
    }
    if (n >= 1e3 && n < 1e9) {
        return n.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (n >= 1e9 && n < 1e12) {
        return '≈' + (n / 1e9).toFixed(1) + 'B';
    }
};

export { cutAddress, cutString, formatDateTime, formatBalance, formatValue }