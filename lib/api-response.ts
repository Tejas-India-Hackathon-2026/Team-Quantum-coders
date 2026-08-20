import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | Record<string, any>;
  statusCode: number;
}

export function successResponse<T>(
  data: T,
  message = "Operation successful",
  statusCode = 200
) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data,
      statusCode,
    },
    { status: statusCode }
  );
}

export function errorResponse(
  message = "An error occurred",
  statusCode = 500,
  error?: any
) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
      error: error || message,
      statusCode,
    },
    { status: statusCode }
  );
}

export function unauthorizedResponse(message = "Authentication required") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Access forbidden") {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = "Resource not found") {
  return errorResponse(message, 404);
}

export function validationErrorResponse(errors: any) {
  return errorResponse("Validation failed", 422, errors);
}
