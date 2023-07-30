import sanitizeHtml from 'sanitize-html';
export function sanitizeInput(dirty, options) {
    /**
     * @type {{allowedAttributes: *[], allowedTags: *[]}}
     */
    const htmlSanitizeOptions = {
        allowedTags: [], allowedAttributes: []
    };

    return sanitizeHtml(dirty, options || htmlSanitizeOptions);
}