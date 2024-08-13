// src/pages/api/users/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { baseDetailResponse, errorDetailHandler } from '@/lib/responseHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(`masuk sini`);
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

        if (req.method === "PUT" || req.method === "PATCH") {
            console.log(`PUT`);
            // Periksa tipe media
            const contentType = req.headers["content-type"] || "";

            if (!contentType.includes("application/json")) {
                return errorDetailHandler(res, 415, 'not_acceptable', `Unsupported media type '${contentType}' in request.`);
            }

            const { username, first_name, last_name, password } = req.body;
            console.log({
                username,
                first_name,
                last_name
            });

            // Validasi data
            const errors: Array<{ code: string; detail: string; attr: string | null }> = [];

            if (!first_name) {
                errors.push({
                    code: "required",
                    detail: "First name is required.",
                    attr: "first_name",
                });
            }

            if (password && password.length < 8) {
                errors.push({
                    code: "min_length",
                    detail: "Password is too short.",
                    attr: "password",
                });
            }

            if (
                allUsers.some(
                    (user) => user.username === username && user.id !== (req.body.id || -1)
                )
            ) {
                errors.push({
                    code: "duplicate",
                    detail: "Username is already taken.",
                    attr: "username",
                });
            }

            if (errors.length > 0) {
                return errorDetailHandler(res, 400, 'validation_error', errors);
            }

            // Simulasi menyimpan perubahan
            const updatedUser = {
                id: req.body.id || -1,
                username,
                first_name,
                last_name,
            };

            // Berikan respons sukses dengan data yang diperbarui
            return baseDetailResponse(res, updatedUser);
        }

        if (!user) {
            return errorDetailHandler(res, 404, 'not_found', 'User not found');
        }

        // Berikan respons sukses dengan data pengguna
        return baseDetailResponse(res, user);

    } catch (error) {
        console.error('Server error:', error);
        return errorDetailHandler(res, 500, 'internal_server_error', 'Server error occurred');
    }
}
