/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate UNC email (@unc.edu.ph)
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is UNC email
 */
export const isUNCEmail = (email) => {
    return email?.endsWith("@unc.edu.ph") || false;
};

/**
 * Validate phone number (Philippine format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone is valid
 */
export const isValidPhone = (phone) => {
    // Philippine mobile: 09XX-XXX-XXXX or +639XX-XXX-XXXX
    // Landline: (0XX) XXX-XXXX
    const phoneRegex = /^(\+639|09)\d{9}$|^\(0\d{2}\)\s?\d{3}-\d{4}$/;
    return phoneRegex.test(phone?.replace(/\s/g, ""));
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 */
export const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validate required field
 * @param {any} value - Value to check
 * @returns {boolean} Whether value is present
 */
export const isRequired = (value) => {
    if (typeof value === "string") {
        return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
};

/**
 * Validate minimum length
 * @param {string} value - String to check
 * @param {number} min - Minimum length
 * @returns {boolean} Whether string meets minimum
 */
export const minLength = (value, min) => {
    return value?.length >= min;
};

/**
 * Validate maximum length
 * @param {string} value - String to check
 * @param {number} max - Maximum length
 * @returns {boolean} Whether string is within maximum
 */
export const maxLength = (value, max) => {
    return value?.length <= max;
};

/**
 * Validate numeric value
 * @param {any} value - Value to check
 * @returns {boolean} Whether value is numeric
 */
export const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validate positive number
 * @param {number} value - Number to check
 * @returns {boolean} Whether number is positive
 */
export const isPositive = (value) => {
    return isNumeric(value) && parseFloat(value) > 0;
};
