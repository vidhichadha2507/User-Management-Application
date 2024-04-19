import { getOrganizationByManagerId } from "@/data/organization";
import { getUserById, getUsersByOrganizationId } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { OrganizationUsers } from "@/models/User";
import { User } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    let allUsers: User[] = [];
    const user = await currentUser();
    if (!user) return new NextResponse("No user found", { status: 403 });
    if (!user.id) return new NextResponse("No user id found", { status: 403 });

    const organizations: OrganizationUsers[] | null =
      await getOrganizationByManagerId(user.id);
    if (!organizations)
      return new NextResponse("No organization found", { status: 200 });

    //Now fetch all the users of the organization of all the organizations
    for (let organization of organizations) {
      const users = await getUsersByOrganizationId(organization.id);

      if (!users) return new NextResponse("No users found", { status: 200 });
      for (let user of users) {
        const currentUser = await getUserById(user.userId);
        if (currentUser && currentUser.name) allUsers.push(currentUser);
      }
      organization.users = allUsers;
      allUsers = [];
    }

    return new NextResponse(JSON.stringify({ organizations }), { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
