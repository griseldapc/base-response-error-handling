// src/pages/api/users/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { baseDetailResponse, errorDetailHandler } from '@/lib/responseHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    // Simulasi data pengguna
    const allUsers = [
        { id: 1, username: 'admin', first_name: 'Super', last_name: 'Admin' },
        { id: 2, username: 'john_lenon', first_name: 'John', last_name: 'Lenon' },
        // Tambahkan data pengguna lainnya sesuai kebutuhan
    ];

    // Temukan pengguna berdasarkan ID
    const user = allUsers.find(user => user.id === parseInt(id as string, 10));

    try {
        // Simulasi otentikasi
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return errorDetailHandler(res, 401, 'not_authenticated', 'Authentication credentials not provided.');
        }

        if (authHeader !== 'Bearer valid_token') {
            return errorDetailHandler(res, 401, 'authentication_failed', 'Incorrect authentication credentials.');
        }

        if (!user) {
            return errorDetailHandler(res, 404, 'not_found', 'User not found');
        }

        // Berikan respons sukses dengan data
        return baseDetailResponse(res, user);

    } catch (error) {
        console.error('Server error:', error);
        return errorDetailHandler(res, 500, 'internal_server_error', 'Server error occurred');
    }
}
