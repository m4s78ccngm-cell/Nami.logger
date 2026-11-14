export default function handler(req, res) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/(?:^|;\s*)nami_session=([^;]+)/);

  if (!match) {
    return res.status(200).json({ authenticated: false });
  }

  try {
    const data = JSON.parse(Buffer.from(match[1], "base64url").toString());
    return res.status(200).json({ authenticated: true, user: data });
  } catch {
    return res.status(200).json({ authenticated: false });
  }
}
