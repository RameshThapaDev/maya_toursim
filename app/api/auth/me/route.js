import { getUserFromToken } from "../../../lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export async function GET() {
  try {
    const user = getUserFromToken();
    if (user) {
      return Response.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
    const session = await getServerSession(authOptions);
    if (session?.user) {
      return Response.json({
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role || "user"
        }
      });
    }
    return Response.json({ user: null }, { status: 200 });
  } catch (error) {
    return Response.json({ user: null }, { status: 200 });
  }
}
