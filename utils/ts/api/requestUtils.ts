export interface RequestHeader {
  key: string;
  value: string;
}

export interface RequestParam {
  key: string;
  value: string;
}

export interface ApiRequest {
  method: string;
  url: string;
  headers: RequestHeader[];
  body: string;
  params: RequestParam[];
}

export interface ApiResponse {
  status: number;
  headers: Record<string, string>;
  responseTime: number;
  data: any;
}

export function buildUrlWithParams(baseUrl: string, params: RequestParam[]): string {
  if (!baseUrl) return '';

  try {
    const url = new URL(baseUrl);
    params.forEach(param => {
      if (param.key && param.value) {
        url.searchParams.set(param.key, param.value);
      }
    });
    return url.toString();
  } catch (error) {
    return baseUrl;
  }
}

export function extractParamsFromUrl(url: string): RequestParam[] {
  if (!url) return [];

  try {
    const urlObj = new URL(url);
    const params: RequestParam[] = [];
    urlObj.searchParams.forEach((value, key) => {
      params.push({ key, value });
    });
    return params;
  } catch {
    return [];
  }
}

export function headersToObject(headers: RequestHeader[]): Record<string, string> {
  return headers.reduce((acc: Record<string, string>, header) => {
    if (header.key && header.value) {
      acc[header.key] = header.value;
    }
    return acc;
  }, {});
}

export function formatJson(jsonString: string): string {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch {
    return jsonString;
  }
}

export function getMethodColor(method: string): string {
  switch (method) {
    case 'GET':
      return 'success';
    case 'POST':
      return 'primary';
    case 'PUT':
      return 'warning';
    case 'DELETE':
      return 'error';
    case 'PATCH':
      return 'secondary';
    default:
      return 'primary';
  }
}

export async function sendApiRequest(request: ApiRequest): Promise<ApiResponse> {
  if (!request.url) {
    throw new Error('Please enter a valid URL');
  }

  try {
    new URL(request.url);
  } catch {
    throw new Error('Invalid URL. Please enter a complete URL (ex: https://api.example.com)');
  }

  let finalUrl = request.url;
  if (request.params.length > 0) {
    finalUrl = buildUrlWithParams(request.url, request.params);
  }

  const headers = headersToObject(request.headers);

  let body: string | null = null;
  if (request.body) {
    try {
      body = JSON.stringify(JSON.parse(request.body));
    } catch {
      body = request.body;
    }
  }

  try {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(finalUrl)}`;
    const startTime = performance.now();

    const responseData = await fetch(proxyUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body || undefined
    });

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    const responseHeaders: Record<string, string> = {};
    responseData.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let responseBody;
    const contentType = responseData.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseBody = await responseData.json();
    } else {
      responseBody = await responseData.text();
    }

    return {
      status: responseData.status,
      headers: responseHeaders,
      responseTime,
      data: responseBody
    };
  } catch (error) {
    throw new Error(`Connection Error: ${error.message}`);
  }
}

export function generateSchema(data: any, depth: number, currentDepth = 0): any {
  if (currentDepth >= depth) {
    return { type: "object", description: "Detailed schema available" };
  }

  if (typeof data !== 'object' || data === null) {
    return { type: typeof data };
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return { type: "array", items: { type: "object" } };

    const sample = data.slice(0, 3);
    return {
      type: "array",
      items: generateSchema(sample[0], depth, currentDepth + 1)
    };
  }

  const properties: Record<string, any> = {};
  const required: string[] = [];

  const entries = Object.entries(data).slice(0, 10);

  for (const [key, value] of entries) {
    properties[key] = generateSchema(value, depth, currentDepth + 1);
    if (value !== null && value !== undefined) {
      required.push(key);
    }
  }

  return {
    type: "object",
    properties,
    required,
    ...(Object.keys(data).length > 10 ? { description: `${Object.keys(data).length - 10} additional properties...` } : {})
  };
}

export function generateOpenApiDocs(request: ApiRequest, response: ApiResponse, options: { schemaDepth: number }): any {
  if (!response?.data) return null;

  try {
    const data = response.data;
    return {
      openapi: "3.0.0",
      info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "Automatically generated documentation"
      },
      paths: {
        [new URL(request.url).pathname]: {
          [request.method.toLowerCase()]: {
            summary: "Generated endpoint",
            parameters: request.params.map(param => ({
              name: param.key,
              in: "query",
              required: true,
              schema: { type: "string" }
            })),
            requestBody: request.body ? {
              required: true,
              content: {
                "application/json": {
                  schema: generateSchema(JSON.parse(request.body), options.schemaDepth)
                }
              }
            } : undefined,
            responses: {
              [response.status]: {
                description: "Successful response",
                content: {
                  "application/json": {
                    schema: generateSchema(data, options.schemaDepth)
                  }
                }
              }
            }
          }
        }
      }
    };
  } catch {
    return null;
  }
}

export function getSampleDataForMethod(method: string): { body: string, params: RequestParam[] } {
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    return {
      body: JSON.stringify({
        key: "value",
        organization: {
          id: 1,
          name: "StackUnity",
          description: "Create, manage and deploy your projects with ease.",
          createdAt: "2025-04-05",
          updatedAt: "2025-04-15"
        }
      }, null, 2),
      params: []
    };
  } else {
    return {
      body: '',
      params: [
        { key: 'page', value: '1' },
        { key: 'limit', value: '10' }
      ]
    };
  }
} 