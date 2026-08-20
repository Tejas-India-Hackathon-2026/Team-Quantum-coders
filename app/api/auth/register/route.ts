import { NextRequest } from "next/server";
import { registerSchema } from "@/lib/validators";
import { AuthService } from "@/services/auth/auth.service";
import { successResponse, validationErrorResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const newUser = await AuthService.registerUser(validation.data);
    return successResponse(newUser, "Account created successfully. You can now log in.", 201);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to register user", 400);
  }
}
