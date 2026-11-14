export default async function handler(req, res) {
  const code = req.query.code;
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || "https://nami-logger.vercel.app/api/auth/callback";

  if (!code) {
    return res.status(400).send("Missing code");
  }
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).send("Missing Discord env vars");
  }

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code: String(code),
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.status(400).send("Token exchange failed");
    }

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const user = await userRes.json();

    const payload = Buffer.from(
      JSON.stringify({ id: user.id, username: user.username })
    ).toString("base64url");

    res.setHeader(
      "Set-Cookie",
      `nami_session=${payload}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
    );
    res.writeHead(302, { Location: "/" });
    res.end();
  } catch (e) {
    res.status(500).send("Auth error");
  }
}
