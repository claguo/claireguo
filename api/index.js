const STARLINK_CHECK_URL = "https://stardrift.ai/api/starlink/check";
const STARLINK_PARAMS = ["flight", "date", "from", "to"];

// stardrift's api only allows its own origin, so the checker on the landing
// page goes through here instead of calling it from the browser
async function starlinkCheck(url) {
  const params = new URLSearchParams();
  for (const key of STARLINK_PARAMS) {
    const value = url.searchParams.get(key);
    if (value) params.set(key, value);
  }

  try {
    const upstream = await fetch(`${STARLINK_CHECK_URL}?${params}`, {
      headers: { accept: "application/json" },
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") || "application/json",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    return Response.json({ detail: "stardrift is unreachable" }, { status: 502 });
  }
}

const handler = {
  fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/starlink/check" && request.method === "GET") {
      return starlinkCheck(url);
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json({
        name: "Cloudflare",
      });
    }

    return env.ASSETS.fetch(request);
  },
};

export default handler;
