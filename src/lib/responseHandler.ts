import { NextApiResponse } from 'next';

// LIST
export const baseResponse = (
    res: NextApiResponse, 
    data: any, 
    page: number, 
    totalData: number) => {
    const totalPage = Math.ceil(totalData / (data.length || 1));

    return res.status(200).json({
        data: data,
        meta: {
            page: page,
            total_data: totalData,
            total_page: totalPage
        }
    });
};

export const errorHandler = (
    res: NextApiResponse, 
    statusCode: number, 
    code: string, 
    detail: string, 
    attr: string | null = null) => {
        const errorResponse = {
            type: statusCode >= 500 ? "server_error" : "client_error",
            errors: [
                {
                    code: code,
                    detail: detail,
                    attr: attr
                }
            ],
            timestamp: new Date().toISOString()
        };

    return res.status(statusCode).json(errorResponse);
};


// DETAIL
export const baseDetailResponse = (res: NextApiResponse, data: any) => {
    return res.status(200).json({
        data: data
    });
};

export const errorDetailHandler = (
    res: NextApiResponse, 
    statusCode: number, 
    code: string, 
    detail: string, 
    attr: string | null = null) => {
    const errorResponse = {
        type: statusCode >= 500 ? "server_error" : "client_error",
        errors: [
            {
                code: code,
                detail: detail,
                attr: attr
            }
        ],
        timestamp: new Date().toISOString()
    };

    return res.status(statusCode).json(errorResponse);
};


// CREATE
export const baseCreateResponse = (res: NextApiResponse, data: any) => {
    return res.status(201).json({
        data: data
    });
};

export const createErrorHandler = (
    res: NextApiResponse, 
    statusCode: number, 
    errors: Array<{ code: string, detail: string, attr: string | null }>) => {
    const errorResponse = {
        type: statusCode >= 500 ? "server_error" : "client_error",
        errors: errors,
        timestamp: new Date().toISOString()
    };

    return res.status(statusCode).json(errorResponse);
};

// DELETE
export const baseDeleteResponse = (res: NextApiResponse) => {
    return res.status(204).end(); // No Content for successful DELETE
};

export const deleteErrorHandler = (
    res: NextApiResponse,
    statusCode: number,
    code: string,
    detail: string,
    attr: string | null = null
) => {
    const errorResponse = {
        type: statusCode >= 500 ? "server_error" : "client_error",
        errors: [
            {
                code: code,
                detail: detail,
                attr: attr
            }
        ],
        timestamp: new Date().toISOString()
    };

    return res.status(statusCode).json(errorResponse);
};
