export function getValidationObserverError(errors: Record<string, string[]>): string {
    for (const fieldName in errors) {
        const fieldErrors: Array<string> = errors[fieldName];
        if (fieldErrors.length) {
            return fieldErrors[0];
        }
    }
    return '';
}
