export interface ApiClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | null | Promise<string | null>;
<<<<<<< HEAD
  onUnauthorized?: () => boolean | Promise<boolean>;
=======
  onUnauthorized?: () => void | Promise<void>;
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
  credentials?: RequestCredentials;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly body: ApiError;

  constructor(status: number, body: ApiError) {
    super(body.message);
    this.name = "ApiClientError";
    this.status = status;
    this.body = body;
  }
}

export class ApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  async request<T>(
    method: string,
    path: string,
    body?: unknown,
    init?: RequestInit,
<<<<<<< HEAD
    canRetry = true,
=======
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
  ): Promise<T> {
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");
    if (body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    const token = this.options.getAccessToken
      ? await this.options.getAccessToken()
      : null;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(new URL(path, this.options.baseUrl), {
      method,
      headers,
      credentials: this.options.credentials ?? "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...init,
    });

    if (response.status === 401 && this.options.onUnauthorized) {
<<<<<<< HEAD
      const recovered = await this.options.onUnauthorized();
      if (recovered && canRetry) {
        return this.request<T>(method, path, body, init, false);
      }
=======
      await this.options.onUnauthorized();
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const errorBody: ApiError =
        data && typeof data === "object" && "error" in data
          ? (data as { error: ApiError }).error
          : {
              code: "UNKNOWN",
              message: response.statusText || "Request failed",
            };
      throw new ApiClientError(response.status, errorBody);
    }

    return data as T;
  }

  get<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>("GET", path, undefined, init);
  }

  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>("POST", path, body, init);
  }

  put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>("PUT", path, body, init);
  }

  patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>("PATCH", path, body, init);
  }

  delete<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>("DELETE", path, undefined, init);
  }
}
