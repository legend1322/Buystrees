// user logout

export async function POST() {
    try {
      // Create a response that removes the authentication cookie
      const response = Response.json({ message: "Logged out successfully" }, { status: 200 });
  
      // Set a cookie with an expired date to remove it
      response.headers.set("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict");
  
      return response;
    } catch (error) {
      console.error("Error during logout:", error);
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  
  