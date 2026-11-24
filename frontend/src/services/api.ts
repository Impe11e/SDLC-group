const TOKEN_KEY = 'token';

export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    const token = tokenStorage.get();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response: Response;
    try {
        response = await fetch(`/api${path}`, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch {
        throw new ApiError(0, 'Сервер недоступний. Перевірте підключення');
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        if (response.status === 401 && token) tokenStorage.clear();
        const message = data?.error ?? data?.message ?? `Помилка сервера (${response.status})`;
        throw new ApiError(response.status, message);
    }

    return data as T;
}

export function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Невідома помилка';
}
