import { NextApiRequest, NextApiResponse } from "next";
import {
  baseResponse,
  errorHandler,
  baseCreateResponse,
  createErrorHandler,
  baseDetailResponse,
  errorDetailHandler,
  baseDeleteResponse,
  deleteErrorHandler
} from "@/lib/responseHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { limit = 10, page = 1, search } = req.query;
  const parsedLimit = parseInt(limit as string, 10);
  const parsedPage = parseInt(page as string, 10);

  // Simulasi data pengguna
  let allUsers = [
    { id: 1, username: "admin", first_name: "Super", last_name: "Admin" },
    { id: 2, username: "john_lenon", first_name: "John", last_name: "Lenon" },
    // Tambahkan data pengguna lainnya sesuai kebutuhan
  ];

  // Simulasi server error
  const simulateServerError = true; // Ubah ke true untuk menguji error 500

  if (simulateServerError) {
    return res.status(500).json({
      type: "server_error",
      errors: [
        {
          code: "internal_server_error",
          detail: "Server error occurred",
          attr: null,
        },
      ],
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method === "POST") {
    // Periksa tipe media
    const contentType = req.headers["content-type"] || "";

    if (!contentType.includes("application/json")) {
      return createErrorHandler(res, 415, [
        {
          code: "not_acceptable",
          detail: `Unsupported media type '${contentType}' in request.`,
          attr: null,
        },
      ]);
    }

    const { username, first_name, last_name, password } = req.body;

    // Validasi data
    const errors: Array<{ code: string; detail: string; attr: string | null }> = [];

    if (!username) {
      errors.push({
        code: "required",
        detail: "Username is required.",
        attr: "username",
      });
    }

    if (!first_name) {
      errors.push({
        code: "required",
        detail: "First name is required.",
        attr: "first_name",
      });
    }

    if (!password) {
      errors.push({
        code: "required",
        detail: "Password is required.",
        attr: "password",
      });
    } else if (password.length < 8) {
      errors.push({
        code: "min_length",
        detail: "Password is too short.",
        attr: "password",
      });
    }

    if (allUsers.some((user) => user.username === username)) {
      errors.push({
        code: "duplicate",
        detail: "Username is already taken.",
        attr: "username",
      });
    }

    if (errors.length > 0) {
      return createErrorHandler(res, 400, errors);
    }

    // Simulasi menyimpan data baru
    const newUser = {
      id: allUsers.length + 1,
      username,
      first_name,
      last_name,
    };

    // Berikan respons sukses dengan data baru
    return baseCreateResponse(res, newUser);
  }

  if (req.method === "GET") {
    try {
      // Filter berdasarkan pencarian jika ada
      const filteredUsers = search
        ? allUsers.filter((user) => user.username.includes(search as string))
        : allUsers;

      // Pagination
      const paginatedUsers = filteredUsers.slice(
        (parsedPage - 1) * parsedLimit,
        parsedPage * parsedLimit
      );

      // Simulasi otentikasi
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return errorHandler(
          res,
          401,
          "not_authenticated",
          "Authentication credentials not provided."
        );
      }

      if (authHeader !== "Bearer valid_token") {
        return errorHandler(
          res,
          401,
          "authentication_failed",
          "Incorrect authentication credentials."
        );
      }

      const hasPermission = true; // Atur ke FALSE jika tidak memiliki permission / izin (GET LIST 200 OK)
      if (!hasPermission) {
        console.log("Permission denied");
        return errorHandler(
          res,
          403,
          "permission_denied",
          "You don't have permission to access this resource."
        );
      }

      // Jika tidak ada data
      if (paginatedUsers.length === 0) {
        return baseResponse(res, [], parsedPage, 0);
      }

      // Berikan response sukses dengan data
      return baseResponse(
        res,
        paginatedUsers,
        parsedPage,
        filteredUsers.length
      );
    } catch (error) {
      console.error("Caught error:", error);
      return errorHandler(
        res,
        500,
        "internal_server_error",
        "Server error occurred"
      );
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    // Periksa tipe media
    const contentType = req.headers["content-type"] || "";

    if (!contentType.includes("application/json")) {
      return createErrorHandler(res, 415, [
        {
          code: "not_acceptable",
          detail: `Unsupported media type '${contentType}' in request.`,
          attr: null,
        },
      ]);
    }

    const { username, first_name, last_name, password } = req.body;

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
      return createErrorHandler(res, 400, errors);
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

  if (req.method === "DELETE") {
    // Simulasi menghapus pengguna
    const { id } = req.query;

    // Validasi ID
    if (!id || isNaN(Number(id))) {
      return deleteErrorHandler(
        res,
        400,
        "invalid_id",
        "Invalid ID provided."
      );
    }

    const userId = Number(id);

    // Simulasi menghapus dari data pengguna
    allUsers = allUsers.filter((user) => user.id !== userId);

    // Jika data tidak ditemukan
    if (allUsers.find((user) => user.id === userId)) {
      return deleteErrorHandler(
        res,
        404,
        "not_found",
        `User with ID ${userId} not found.`
      );
    }

    // Berikan respons sukses tanpa konten
    return baseDeleteResponse(res);
  }

  // Metode tidak didukung
  return res.status(405).json({
    type: "client_error",
    errors: [
      {
        code: "method_not_allowed",
        detail: "Method Not Allowed",
      },
    ],
    timestamp: new Date().toISOString(),
  });
}
