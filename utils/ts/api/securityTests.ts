import { ApiRequest, buildUrlWithParams, headersToObject } from './requestUtils';

export interface ApiTestResult {
  name: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  impact?: string;
  recommendation?: string;
  response?: {
    status: number;
    data: any;
  };
}


export async function testSqlInjection(originalRequest: ApiRequest): Promise<ApiTestResult> {
  const sqlPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "' UNION SELECT username, password FROM users --",
    "admin' --"
  ];

  if (!(originalRequest.method === 'GET' && originalRequest.params.length > 0) &&
    !((['POST', 'PUT', 'PATCH'].includes(originalRequest.method)) && originalRequest.body)) {
    return {
      name: "Injection SQL",
      description: "Vérifiy if the API is vulnerable to SQL injection by sending malicious payloads",
      status: 'info',
      message: "Test ignored: the method or parameters are not appropriate for this test",
      impact: "SQL injection can allow attackers to access, modify or delete data",
      recommendation: "Use parameterized queries or ORMs with proper escaping of user inputs"
    };
  }

  for (const payload of sqlPayloads) {
    try {
      let testResponse;

      if (originalRequest.method === 'GET') {
        const modifiedParams = [...originalRequest.params];
        if (modifiedParams.length > 0 && modifiedParams[0].key) {
          modifiedParams[0].value = payload;
        }

        let testUrl = originalRequest.url;
        const url = new URL(testUrl);
        modifiedParams.forEach(param => {
          if (param.key && param.value) {
            url.searchParams.set(param.key, param.value);
          }
        });
        testUrl = url.toString();

        const proxyUrl = `/api/proxy?url=${encodeURIComponent(testUrl)}`;
        testResponse = await fetch(proxyUrl, {
          method: 'GET',
          headers: headersToObject(originalRequest.headers)
        });
      } else {
        let modifiedBody;
        try {
          const bodyObj = JSON.parse(originalRequest.body);
          const firstKey = Object.keys(bodyObj)[0];
          if (firstKey) {
            bodyObj[firstKey] = payload;
          }
          modifiedBody = JSON.stringify(bodyObj);
        } catch (e) {
          modifiedBody = payload;
        }

        const proxyUrl = `/api/proxy?url=${encodeURIComponent(originalRequest.url)}`;
        testResponse = await fetch(proxyUrl, {
          method: originalRequest.method,
          headers: {
            'Content-Type': 'application/json',
            ...headersToObject(originalRequest.headers)
          },
          body: modifiedBody
        });
      }

      const responseStatus = testResponse.status;
      let responseData;
      try {
        responseData = await testResponse.json();
      } catch (e) {
        responseData = await testResponse.text();
      }

      const responseText = JSON.stringify(responseData).toLowerCase();

      const sqlSuccessPatterns = [
        'username', 'password', 'email', 'user_id', 'id:',
        'table', 'column', 'database', 'select', 'insert',
        'record', 'records', 'result', 'results', 'row', 'rows'
      ];

      const sqlErrorPatterns = [
        'syntax error', 'sql syntax', 'unterminated', 'sql statement',
        'sql error', 'mysql', 'postgresql', 'sqlite', 'oracle',
        'invalid query', 'syntax near'
      ];

      const hasSuccessPattern = sqlSuccessPatterns.some(pattern => responseText.includes(pattern));
      const hasErrorPattern = sqlErrorPatterns.some(pattern => responseText.includes(pattern));

      const isGenericError = responseText.includes('invalid') && responseText.includes('url');
      const isVulnerable = responseStatus >= 200 && responseStatus < 300 &&
        (hasSuccessPattern || hasErrorPattern) &&
        !isGenericError;

      if (isVulnerable) {
        return {
          name: "Injection SQL",
          description: `Check if the API is vulnerable to SQL injection with the payload: ${payload}`,
          status: 'warning',
          message: "Potentially vulnerable: the request succeeded with a suspicious SQL payload",
          impact: "SQL injection can allow attackers to access, modify or delete data",
          recommendation: "Use parameterized queries or ORMs with proper escaping of user inputs",
          response: {
            status: responseStatus,
            data: responseData
          }
        };
      }
    } catch (error) {
      console.error(`Error during SQL injection test with ${payload}:`, error);
    }
  }

  return {
    name: "SQL Injection",
    description: "Check if the API is vulnerable to SQL injection by sending malicious payloads",
    status: 'success',
    message: "No SQL injection vulnerability detected",
    recommendation: "Continue to use parameterized queries and validate user inputs"
  };
}

export async function testXss(originalRequest: ApiRequest): Promise<ApiTestResult> {
  const xssPayloads = [
    "<script>alert('xss')</script>",
    "<img src=x onerror=alert('xss')>",
    "\"><script>alert('xss')</script>",
    "javascript:alert('xss')"
  ];

  if (!(originalRequest.method === 'GET' && originalRequest.params.length > 0) &&
    !((['POST', 'PUT', 'PATCH'].includes(originalRequest.method)) && originalRequest.body)) {
    return {
      name: "Cross-Site Scripting (XSS)",
      description: "Check if the API is vulnerable to XSS attacks by returning unescaped content",
      status: 'info',
      message: "Test ignored: the method or parameters are not appropriate for this test",
      impact: "XSS attacks can allow malicious JavaScript code to be executed in the user's browser",
      recommendation: "Always escape dynamic content and use a strict CSP policy"
    };
  }

  for (const payload of xssPayloads) {
    try {
      let testResponse;

      if (originalRequest.method === 'GET') {
        const modifiedParams = [...originalRequest.params];
        if (modifiedParams.length > 0 && modifiedParams[0].key) {
          modifiedParams[0].value = payload;
        }

        const testUrl = buildUrlWithParams(originalRequest.url, modifiedParams);
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(testUrl)}`;
        testResponse = await fetch(proxyUrl, {
          method: 'GET',
          headers: headersToObject(originalRequest.headers)
        });
      } else {
        let modifiedBody;
        try {
          const bodyObj = JSON.parse(originalRequest.body);
          const firstKey = Object.keys(bodyObj)[0];
          if (firstKey) {
            bodyObj[firstKey] = payload;
          }
          modifiedBody = JSON.stringify(bodyObj);
        } catch (e) {
          modifiedBody = payload;
        }

        const proxyUrl = `/api/proxy?url=${encodeURIComponent(originalRequest.url)}`;
        testResponse = await fetch(proxyUrl, {
          method: originalRequest.method,
          headers: {
            'Content-Type': 'application/json',
            ...headersToObject(originalRequest.headers)
          },
          body: modifiedBody
        });
      }

      const responseStatus = testResponse.status;
      let responseData;
      try {
        responseData = await testResponse.json();
      } catch (e) {
        responseData = await testResponse.text();
      }

      const responseText = typeof responseData === 'string'
        ? responseData
        : JSON.stringify(responseData);

      const isVulnerable = responseStatus >= 200 && responseStatus < 300 &&
        xssPayloads.some(p => responseText.includes(p));

      if (isVulnerable) {
        return {
          name: "Cross-Site Scripting (XSS)",
          description: "Check if the API is vulnerable to XSS attacks by returning unescaped content",
          status: 'warning',
          message: "Potentially vulnerable: the API returns unescaped scripts",
          impact: "XSS attacks can allow malicious JavaScript code to be executed in the user's browser",
          recommendation: "Always escape dynamic content and use a strict CSP policy",
          response: {
            status: responseStatus,
            data: responseData
          }
        };
      }
    } catch (error) {
      console.error(`Error during XSS test with ${payload}:`, error);
    }
  }

  return {
    name: "Cross-Site Scripting (XSS)",
    description: "Check if the API is vulnerable to XSS attacks by returning unescaped content",
    status: 'info',
    message: "Limited test: XSS vulnerabilities depend mainly on the frontend",
    impact: "XSS attacks can allow malicious JavaScript code to be executed in the user's browser",
    recommendation: "Always escape dynamic content and use a strict CSP policy"
  };
}

export async function testNoSqlInjection(originalRequest: ApiRequest): Promise<ApiTestResult> {
  const noSqlPayloads = [
    '{"$gt": ""}',
    '{"$ne": null}',
    '{"$where": "this.password == this.password"}',
    '{"$regex": ".*"}'
  ];

  if (!(['POST', 'PUT', 'PATCH'].includes(originalRequest.method)) || !originalRequest.body) {
    return {
      name: "NoSQL Injection",
      description: "Check if the API is vulnerable to NoSQL injections (MongoDB, etc.)",
      status: 'info',
      message: "Test applicable only to requests with JSON body",
      impact: "NoSQL injections can allow attackers to bypass authentication or access unauthorized data",
      recommendation: "Use secure methods to build NoSQL queries and validate inputs strictly"
    };
  }

  try {
    JSON.parse(originalRequest.body);
  } catch (e) {
    return {
      name: "NoSQL Injection",
      description: "Check if the API is vulnerable to NoSQL injections (MongoDB, etc.)",
      status: 'info',
      message: "Test ignored: the body is not a valid JSON",
      impact: "NoSQL injections can allow attackers to bypass authentication or access unauthorized data",
      recommendation: "Use secure methods to build NoSQL queries and validate inputs strictly"
    };
  }

  for (const payload of noSqlPayloads) {
    try {
      const bodyObj = JSON.parse(originalRequest.body);
      const firstKey = Object.keys(bodyObj)[0];
      if (firstKey) {
        try {
          bodyObj[firstKey] = JSON.parse(payload);
        } catch {
          bodyObj[firstKey] = payload;
        }
      }
      const modifiedBody = JSON.stringify(bodyObj);

      const proxyUrl = `/api/proxy?url=${encodeURIComponent(originalRequest.url)}`;
      const testResponse = await fetch(proxyUrl, {
        method: originalRequest.method,
        headers: {
          'Content-Type': 'application/json',
          ...headersToObject(originalRequest.headers)
        },
        body: modifiedBody
      });

      const responseStatus = testResponse.status;
      let responseData;
      try {
        responseData = await testResponse.json();
      } catch (e) {
        responseData = await testResponse.text();
      }

      const responseText = JSON.stringify(responseData).toLowerCase();
      const successPatterns = [
        'user', 'username', 'password', 'email', 'account',
        'authenticated', 'token', 'session', 'data', 'document'
      ];

      const isSuccess = responseStatus >= 200 && responseStatus < 300 &&
        successPatterns.some(pattern => responseText.includes(pattern));

      if (isSuccess) {
        return {
          name: "NoSQL Injection",
          description: "Check if the API is vulnerable to NoSQL injections (MongoDB, etc.)",
          status: 'warning',
          message: `Potentially vulnerable: the API accepts NoSQL operators like '${payload}'`,
          impact: "NoSQL injections can allow attackers to bypass authentication or access unauthorized data",
          recommendation: "Use secure methods to build NoSQL queries and validate inputs strictly",
          response: {
            status: responseStatus,
            data: responseData
          }
        };
      }
    } catch (error) {
      console.error(`Error during NoSQL injection test with ${payload}:`, error);
    }
  }

  return {
    name: "NoSQL Injection",
    description: "Check if the API is vulnerable to NoSQL injections (MongoDB, etc.)",
    status: 'info',
    message: "No obvious NoSQL injection vulnerability, but tests are limited",
    impact: "NoSQL injections can allow attackers to bypass authentication or access unauthorized data",
    recommendation: "Use secure methods to build NoSQL queries and validate inputs strictly"
  };
}

export async function testArbitraryParams(originalRequest: ApiRequest): Promise<ApiTestResult> {
  if (originalRequest.method !== 'GET') {
    return {
      name: "Arbitrary Parameters",
      description: "Check if the API accepts undocumented parameters that can reveal hidden features",
      status: 'success',
      message: "Test not applicable: different method than GET",
      recommendation: "Filter and validate all request parameters strictly"
    };
  }

  const probeParams = [
    { key: "debug", value: "true" },
    { key: "admin", value: "true" },
    { key: "test", value: "true" },
    { key: "internal", value: "true" },
    { key: "mode", value: "debug" }
  ];

  for (const probeParam of probeParams) {
    try {
      const modifiedParams = [...originalRequest.params, probeParam];
      const testUrl = buildUrlWithParams(originalRequest.url, modifiedParams);

      const proxyUrl = `/api/proxy?url=${encodeURIComponent(testUrl)}`;
      const testResponse = await fetch(proxyUrl, {
        method: 'GET',
        headers: headersToObject(originalRequest.headers)
      });

      const responseStatus = testResponse.status;
      let responseData;
      try {
        responseData = await testResponse.json();
      } catch (e) {
        responseData = await testResponse.text();
      }

      const responseText = JSON.stringify(responseData).toLowerCase();
      const debugPatterns = [
        'debug', 'trace', 'internal', 'stack', 'verbose', 'dev',
        'development', 'admin', 'config', 'settings'
      ];

      const hasDebugInfo = debugPatterns.some(pattern => responseText.includes(pattern));
      const isDifferent = responseText.length > JSON.stringify(originalRequest).length + 50;

      if (responseStatus >= 200 && responseStatus < 300 && (hasDebugInfo || isDifferent)) {
        return {
          name: "Arbitrary Parameters",
          description: "Check if the API accepts undocumented parameters that can reveal hidden features",
          status: 'warning',
          message: `The parameter '${probeParam.key}=${probeParam.value}' seems to activate hidden features`,
          recommendation: "Filter and validate all request parameters strictly, disable debug modes in production",
          response: {
            status: responseStatus,
            data: responseData
          }
        };
      }
    } catch (error) {
      console.error(`Error during arbitrary parameters test with ${probeParam.key}:`, error);
    }
  }

  return {
    name: "Arbitrary Parameters",
    description: "Check if the API accepts undocumented parameters that can reveal hidden features",
    status: 'success',
    message: "No arbitrary parameter revealed hidden features",
    recommendation: "Continue to filter and validate all request parameters strictly"
  };
}

export async function testCorsConfiguration(originalRequest: ApiRequest): Promise<ApiTestResult> {
  try {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(originalRequest.url)}`;
    const testResponse = await fetch(proxyUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://malicious-site.com',
        'Access-Control-Request-Method': originalRequest.method,
        'Access-Control-Request-Headers': 'Content-Type',
        ...headersToObject(originalRequest.headers)
      }
    });

    const corsHeaders = {
      'Access-Control-Allow-Origin': testResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': testResponse.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': testResponse.headers.get('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': testResponse.headers.get('Access-Control-Allow-Credentials')
    };

    const isPermissive = corsHeaders['Access-Control-Allow-Origin'] === '*' ||
      corsHeaders['Access-Control-Allow-Origin']?.includes('malicious-site.com');
    const allowCredentials = corsHeaders['Access-Control-Allow-Credentials'] === 'true';

    if (isPermissive && allowCredentials) {
      return {
        name: "CORS Configuration",
        description: "Check if the CORS configuration allows insecure cross-origin requests",
        status: 'warning',
        message: "Insecure CORS configuration: allows all origins with credentials",
        impact: "An overly permissive CORS configuration can allow CSRF attacks and unauthorized access to data",
        recommendation: "Configure CORS to allow only specific trusted origins and limit allowed methods",
        response: {
          status: testResponse.status,
          data: corsHeaders
        }
      };
    }

    if (isPermissive) {
      return {
        name: "CORS Configuration",
        description: "Check if the CORS configuration allows insecure cross-origin requests",
        status: 'info',
        message: "Permissive CORS configuration: allows wide origins, but without credentials",
        impact: "An overly permissive CORS configuration can allow CSRF attacks and unauthorized access to data",
        recommendation: "Configure CORS to allow only specific trusted origins and limit allowed methods",
        response: {
          status: testResponse.status,
          data: corsHeaders
        }
      };
    }

    return {
      name: "CORS Configuration",
      description: "Check if the CORS configuration allows insecure cross-origin requests",
      status: 'success',
      message: "The CORS configuration seems to be properly restricted",
      recommendation: "Continue to limit allowed origins to trusted domains",
      response: {
        status: testResponse.status,
        data: corsHeaders
      }
    };
  } catch (error) {
    console.error('Error during CORS configuration test:', error);
    return {
      name: "CORS Configuration",
      description: "Check if the CORS configuration allows insecure cross-origin requests",
      status: 'info',
      message: "Test requires a cross-origin domain",
      impact: "An overly permissive CORS configuration can allow CSRF attacks and unauthorized access to data",
      recommendation: "Configure CORS to allow only specific trusted origins and limit allowed methods"
    };
  }
}

export async function testContentTypeManipulation(originalRequest: ApiRequest): Promise<ApiTestResult> {
  if (!(['POST', 'PUT', 'PATCH'].includes(originalRequest.method)) || !originalRequest.body) {
    return {
      name: "Content Type Manipulation",
      description: "Check if the API handles different content types correctly",
      status: 'info',
      message: "Test applicable only to requests with body",
      recommendation: "Always validate the Content-Type and the format of incoming data"
    };
  }

  const contentTypes = [
    'application/xml',
    'text/plain',
    'application/x-www-form-urlencoded',
    'multipart/form-data'
  ];

  for (const contentType of contentTypes) {
    try {
      const modifiedHeaders = [...originalRequest.headers];
      const contentTypeIndex = modifiedHeaders.findIndex(h => h.key.toLowerCase() === 'content-type');
      if (contentTypeIndex >= 0) {
        modifiedHeaders[contentTypeIndex].value = contentType;
      } else {
        modifiedHeaders.push({ key: 'Content-Type', value: contentType });
      }

      const proxyUrl = `/api/proxy?url=${encodeURIComponent(originalRequest.url)}`;
      const testResponse = await fetch(proxyUrl, {
        method: originalRequest.method,
        headers: headersToObject(modifiedHeaders),
        body: originalRequest.body
      });

      const responseStatus = testResponse.status;
      let responseData;
      try {
        responseData = await testResponse.json();
      } catch (e) {
        responseData = await testResponse.text();
      }

      if (responseStatus >= 200 && responseStatus < 300) {
        return {
          name: "Content Type Manipulation",
          description: "Check if the API handles different content types correctly",
          status: 'warning',
          message: `The API accepts an inappropriate Content-Type (${contentType})`,
          recommendation: "Strictly validate the Content-Type and reject requests with inappropriate content types",
          response: {
            status: responseStatus,
            data: responseData
          }
        };
      }
    } catch (error) {
      console.error(`Error during Content-Type manipulation test with ${contentType}:`, error);
    }
  }

  return {
    name: "Content Type Manipulation",
    description: "Check if the API handles different content types correctly",
    status: 'success',
    message: "The API correctly validates content types",
    recommendation: "Continue to validate the Content-Type and the format of incoming data"
  };
}

export async function runAllSecurityTests(request: ApiRequest): Promise<ApiTestResult[]> {
  const results: ApiTestResult[] = [];

  try {
    results.push(await testSqlInjection(request));

    results.push(await testXss(request));

    results.push(await testNoSqlInjection(request));

    results.push(await testArbitraryParams(request));

    results.push(await testCorsConfiguration(request));

    results.push(await testContentTypeManipulation(request));
  } catch (error) {
    console.error('Erreur lors de l\'exécution des tests de sécurité:', error);
  }

  return results;
} 