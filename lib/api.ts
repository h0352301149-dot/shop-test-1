import type {
  LoginResponse,
  Product,
  ProductStatus,
  RegisterResponse,
  User,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "Thiếu NEXT_PUBLIC_API_URL trong .env.local",
  );
}

/* ============================================================
   API REQUEST
============================================================ */

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = false,
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("shop_token")
      : null;

  if (requireAuth && !token) {
    const error = new Error(
      "Bạn chưa đăng nhập hoặc phiên đăng nhập không hợp lệ.",
    );

    (error as Error & { status?: number }).status = 401;

    throw error;
  }

  const requestHeaders = new Headers();

  requestHeaders.set(
    "Content-Type",
    "application/json",
  );

  if (token) {
    requestHeaders.set(
      "Authorization",
      "Bearer " + token,
    );
  }

  let response: Response;

  try {
    response = await fetch(
      API_URL + endpoint,
      {
        ...options,
        headers: requestHeaders,
        cache: "no-store",
      },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw error;
    }

    const networkError = new Error(
      "Không thể kết nối đến máy chủ API. Vui lòng kiểm tra mạng hoặc máy chủ.",
    );

    (
      networkError as Error & {
        isNetworkError?: boolean;
      }
    ).isNetworkError = true;

    throw networkError;
  }

  const text = await response.text();

  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    let message =
      "API trả về lỗi HTTP " +
      response.status +
      ".";

    if (
      data &&
      typeof data === "object"
    ) {
      const objectData =
        data as Record<string, unknown>;

      if (
        typeof objectData.message === "string" &&
        objectData.message.trim()
      ) {
        message = objectData.message;
      } else if (
        typeof objectData.error === "string" &&
        objectData.error.trim()
      ) {
        message = objectData.error;
      }
    } else if (
      typeof data === "string" &&
      data.trim()
    ) {
      message = data;
    }

    if (response.status === 400) {
      message =
        message ||
        "Dữ liệu gửi lên không hợp lệ.";
    }

    if (response.status === 401) {
      message =
        "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.";
    }

    if (response.status === 409) {
      message =
        "Email đã tồn tại.";
    }

    const error = new Error(message);

    (
      error as Error & {
        status?: number;
      }
    ).status = response.status;

    throw error;
  }

  return data as T;
}

/* ============================================================
   REGISTER
============================================================ */

export async function registerUser(
  email: string,
  password: string,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(
    "/register",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    },
    false,
  );
}

/* ============================================================
   LOGIN
============================================================ */

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    "/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    },
    false,
  );
}

/* ============================================================
   LOGOUT
============================================================ */

export async function logoutUser(): Promise<void> {
  await apiRequest(
    "/logout",
    {
      method: "POST",
    },
    true,
  );
}

/* ============================================================
   CURRENT USER
============================================================ */

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>(
    "/me",
    {
      method: "GET",
    },
    true,
  );
}

/* ============================================================
   PRODUCTS RESPONSE
============================================================ */

interface ProductsResponse {
  items: Product[];
  total: number;
}

/* ============================================================
   GET PRODUCTS
============================================================ */

export async function getProducts(
  status?: ProductStatus,
  signal?: AbortSignal,
): Promise<Product[]> {
  let endpoint = "/products";

  if (status) {
    endpoint =
      "/products?status=" +
      encodeURIComponent(status);
  }

  const response =
    await apiRequest<ProductsResponse>(
      endpoint,
      {
        method: "GET",
        signal,
      },
      true,
    );

  if (
    !response ||
    !Array.isArray(response.items)
  ) {
    throw new Error(
      "Dữ liệu sản phẩm từ API không hợp lệ.",
    );
  }

  return response.items;
}