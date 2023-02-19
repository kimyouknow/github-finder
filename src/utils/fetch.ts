export interface FetchOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: string
}

export class FetchError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export const fetchData = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  const { method = 'GET', headers = {}, body } = options

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body,
    })

    if (!response.ok) {
      throw new FetchError(response.statusText, response.status)
    }

    const data = (await response.json()) as T
    return data
  } catch (error) {
    if (error instanceof FetchError) {
      console.error(`Fetch failed: ${error.message} (${error.status})`)
    } else {
      console.error(`Fetch failed: `, error)
    }
    throw error
  }
}
