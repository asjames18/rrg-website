/**
 * Centralized error handler utility
 * Provides consistent error responses across all API endpoints
 */

import { logger } from './logger';

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

export class ApiErrorResponse extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = 'ApiErrorResponse';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function createErrorResponse(
  error: unknown,
  defaultMessage = 'An error occurred',
  defaultStatusCode = 500
): Response {
  let message = defaultMessage;
  let statusCode = defaultStatusCode;
  let details: unknown = undefined;

  if (error instanceof ApiErrorResponse) {
    message = error.message;
    statusCode = error.statusCode;
    details = error.details;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  // Log error
  logger.error('API Error:', {
    message,
    statusCode,
    details,
    stack: error instanceof Error ? error.stack : undefined,
  });

  // Don't expose internal error details in production
  const isDev = import.meta.env.DEV;
  const responseBody: ApiError = {
    error: statusCode >= 500 ? 'Internal Server Error' : 'Bad Request',
    message: isDev ? message : (statusCode >= 500 ? defaultMessage : message),
    statusCode,
  };

  if (isDev && details) {
    responseBody.details = details;
  }

  return new Response(JSON.stringify(responseBody), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function createSuccessResponse(data: unknown, statusCode = 200): Response {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function handleApiRoute<T>(
  handler: () => Promise<T>
): Promise<Response> {
  return handler()
    .then((data) => createSuccessResponse(data))
    .catch((error) => createErrorResponse(error));
}

