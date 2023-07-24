import sanitizeHtml from 'sanitize-html';
export function sanitizeInput(dirty, options) {
    const htmlSanitizeOptions = {
        allowedTags: [], allowedAttributes: []
    };

    return sanitizeHtml(dirty, options || htmlSanitizeOptions);
}