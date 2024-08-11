// src/pages/api/users.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { baseResponse, errorHandler } from '@/lib/responseHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { limit = 10, page = 1, search } = req.query;
    const parsedLimit = parseInt(limit as string, 10);
    const parsedPage = parseInt(page as string, 10);

    // Simulasi data pengguna
    const allUsers = [
        { id: 1, username: 'admin', first_name: 'Super', last_name: 'Admin' },
        { id: 2, username: 'john_lenon', first_name: 'John', last_name: 'Lenon' },
        // Tambahkan data pengguna lainnya sesuai kebutuhan
    ];

    // Filter berdasarkan pencarian jika ada
    const filteredUsers = search
        ? allUsers.filter(user => user.username.includes(search as string))
        : allUsers;

    // Pagination
    const paginatedUsers = filteredUsers.slice((parsedPage - 1) * parsedLimit, parsedPage * parsedLimit);

    try {
        // Simulasi otentikasi
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return errorHandler(res, 401, 'not_authenticated', 'Authentication credentials not provided.');
        }

        if (authHeader !== 'Bearer valid_token') {
            return errorHandler(res, 401, 'authentication_failed', 'Incorrect authentication credentials.');
        }

        const hasPermission = false; // Atur ke true jika pengguna memiliki izin yang benar
        if (!hasPermission) {
            console.log('Permission denied');
            return errorHandler(res, 403, 'permission_denied', "You don't have permission to access this resource.");
        }

        // Jika tidak ada data
        if (paginatedUsers.length === 0) {
            return baseResponse(res, [], parsedPage, 0);
        }

        // Berikan response sukses dengan data
        return baseResponse(res, paginatedUsers, parsedPage, filteredUsers.length);

    } catch (error) {
        console.error('Caught error:', error);
        return errorHandler(res, 500, 'internal_server_error', 'Server error occurred');
    }
}
