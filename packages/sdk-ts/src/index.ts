/** Options for a merchant-operated PayFreo Core health client. */
export interface PayFreoClientOptions {
  baseUrl: string;
  fetch?: typeof globalThis.fetch;
  timeoutMs?: number;
}

export class PayFreoHttpError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`PayFreo Core responded with HTTP ${status}`);
    this.name = 'PayFreoHttpError';
    this.status = status;
  }
}

export class PayFreoProtocolError extends Error {
  constructor(endpoint: string) {
    super(`PayFreo Core returned an invalid response from ${endpoint}`);
    this.name = 'PayFreoProtocolError';
  }
}

/** A small client for the two health endpoints available in the current Core. */
export class PayFreoClient {
  readonly #baseUrl: URL;
  readonly #fetch: typeof globalThis.fetch;
  readonly #timeoutMs: number;

  constructor(options: PayFreoClientOptions) {
    const baseUrl = new URL(options.baseUrl);
    if (
      !['http:', 'https:'].includes(baseUrl.protocol) ||
      baseUrl.username ||
      baseUrl.password ||
      baseUrl.search ||
      baseUrl.hash
    ) {
      throw new TypeError('baseUrl must be an HTTP(S) URL without credentials, query, or fragment');
    }

    const timeoutMs = options.timeoutMs ?? 5_000;
    if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
      throw new RangeError('timeoutMs must be a positive safe integer');
    }

    baseUrl.pathname = `${baseUrl.pathname.replace(/\/$/, '')}/`;
    this.#baseUrl = baseUrl;
    this.#fetch = options.fetch ?? globalThis.fetch;
    this.#timeoutMs = timeoutMs;
  }

  /** Reports whether the Core process answers HTTP requests. */
  async live(): Promise<{ status: 'ok' }> {
    return this.#request('health/live', 'ok');
  }

  /** Reports whether the Core can query its local database. */
  async ready(): Promise<{ status: 'ready' }> {
    return this.#request('health/ready', 'ready');
  }

  async #request<T extends 'ok' | 'ready'>(
    endpoint: string,
    expectedStatus: T,
  ): Promise<{ status: T }> {
    const url = new URL(endpoint, this.#baseUrl);
    const response = await this.#fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(this.#timeoutMs),
    });

    if (!response.ok) {
      throw new PayFreoHttpError(response.status);
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new PayFreoProtocolError(endpoint);
    }

    if (!isExpectedHealthResponse(body, expectedStatus)) {
      throw new PayFreoProtocolError(endpoint);
    }

    return { status: expectedStatus };
  }
}

function isExpectedHealthResponse<T extends 'ok' | 'ready'>(
  value: unknown,
  status: T,
): value is { status: T } {
  return (
    typeof value === 'object' && value !== null && 'status' in value && value.status === status
  );
}
