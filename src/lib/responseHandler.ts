import { NextApiResponse } from 'next';

// LIST
export const baseResponse = (res: NextApiResponse, data: any, page: number, totalData: number) => {
    const totalPage = Math.ceil(totalData / 10); // Asumsikan limit default 10

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
        ]
    };

    return res.status(statusCode).json(errorResponse);
};


// DETAIL
export const baseDetailResponse = (res: NextApiResponse, data: any) => {
    return res.status(200).json({
        data: data
    });
};

export const errorDetailHandler = (res: NextApiResponse, statusCode: number, code: string, detail: string, attr: string | null = null) => {
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
