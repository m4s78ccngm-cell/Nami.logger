export default function handler(req, res) {
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || "https://nami-logger.vercel.app/api/auth/callback";

  if (!CLIENT_ID) {
    return res.status(500).send("Missing DISCORD_CLIENT_ID");
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "identify",
  });

  res.writeHead(302, {
    Location: `https://discord.com/api/oauth2/authorize?${params.toString()}`,
  });
  res.end();
}
