import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  return successResponse(null, "Logged out successfully");
}
