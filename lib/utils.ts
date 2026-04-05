import dayjs from "dayjs";

/**
 * Formats a number as standard Australian money ($ with exactly two decimal places, defaulting to AUD).
 * @param value The amount to format.
 * @param currency The currency code (defaults to 'AUD').
 * @returns A formatted currency string.
 */
export const formatCurrency = (value: number, currency: string = 'AUD'): string => {
	try {
		return new Intl.NumberFormat('en-AU', {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	} catch (error) {
		// Fallback if formatting fails (e.g., invalid currency code)
		const formattedValue = value.toFixed(2);
		return `${currency} ${formattedValue}`;
	}
};

export const formatSubscriptionDateTime = (value?: string): string => {
	if (!value) return "Not provided";
	const parsedDate = dayjs(value);
	return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
	if (!value) return "Unknown";
	return value.charAt(0).toUpperCase() + value.slice(1);
};
