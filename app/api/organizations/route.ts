import { getAllOrganizations } from "@/data/organization";
import { getUserById } from "@/data/user";
import { NextResponse } from "next/server";

/**
 * Retrieves all organizations with manager details.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object containing the organizations with manager details.
 */
export async function GET() {
  try {
    const organizations = await getAllOrganizations();

    // Fetch user details for each manager and add them to the response
    if (!organizations)
      return new NextResponse("No Organizations found", { status: 403 });

    const organizationsWithManagerDetails = await Promise.all(
      organizations.map(async (org) => {
        if (!org.managerId) return org;
        const manager = await getUserById(org.managerId);
        return { ...org, manager };
      })
    );

    return new NextResponse(JSON.stringify(organizationsWithManagerDetails), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error", { status: 403 });
  }
}
