import { currentRole } from "@/lib/auth";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Handles the GET request for the admin route.
 * Checks the current user's role and returns an appropriate response.
 * If the user has the role of ADMIN, a 200 status response is returned.
 * Otherwise, a 403 status response is returned.
 * @returns {Promise<NextResponse>} The response object.
 */
export async function GET() {
  const role = await currentRole();
  if (role === Role.ADMIN) {
    return new NextResponse(null, { status: 200 });
  }
  return new NextResponse(null, { status: 403 });
}
