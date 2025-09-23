export declare const ValidationPatterns: {
    email: RegExp;
    phone: RegExp;
    url: RegExp;
    password: RegExp;
    hexColor: RegExp;
    objectId: RegExp;
    linkedinUrl: RegExp;
    githubUrl: RegExp;
};
export declare const ValidationMessages: {
    email: string;
    phone: string;
    url: string;
    password: string;
    required: (field: string) => string;
    minLength: (field: string, min: number) => string;
    maxLength: (field: string, max: number) => string;
    betweenLength: (field: string, min: number, max: number) => string;
    numeric: (field: string) => string;
    boolean: (field: string) => string;
    array: (field: string) => string;
    objectId: string;
    duplicate: (field: string) => string;
    notFound: (field: string) => string;
};
export declare const sanitizeInput: (input: string) => string;
export declare const isValidFileType: (filename: string, allowedTypes: string[]) => boolean;
export declare const generateSlug: (text: string) => string;
export declare const validatePagination: (page?: string, limit?: string) => {
    page: number;
    limit: number;
};
//# sourceMappingURL=validationUtils.d.ts.map