export default {
    publicApis: [/\/sign-up/, /\/login/, /\/_api/, /\/docs/],
    passwordRegExp: /^[A-Z|a-z|0-9|_|-]{8,}$/,
    bcryptPrefixPhp: '$2y$',
    bcryptPrefixNode: '$2b$',
    businessCanvasStatusDraft: 'draft',
    businessCanvasStatusPosted: 'posted'
}