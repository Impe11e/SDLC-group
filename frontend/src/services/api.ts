const CURRENT_USER_ID = 1;

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
    let response: Response;
    try {
        response = await fetch(`/api${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': String(CURRENT_USER_ID),
            },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch {
        throw new ApiError(0, 'Сервер недоступний. Перевірте підключення');
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.error ?? data?.message ?? `Помилка сервера (${response.status})`;
        throw new ApiError(response.status, message);
    }

    return data as T;
}

export function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Невідома помилка';
}
