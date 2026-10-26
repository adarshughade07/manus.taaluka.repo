const FORM_NAME = "taaluka-waitlist";
const API_BASE = "https://api.netlify.com/api/v1";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
    },
  });
}

export default async function handler() {
  const token = process.env.NETLIFY_AUTH_TOKEN;
  const siteId = process.env.SITE_ID;

  if (!token || !siteId) {
    return json({ available: false }, 503);
  }

  try {
    const response = await fetch(`${API_BASE}/sites/${siteId}/forms`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return json({ available: false }, 502);
    }

    const forms = (await response.json()) as Array<{
      name?: string;
      submission_count?: number;
    }>;
    const waitlist = forms.find(form => form.name === FORM_NAME);
    const totalCount = Number(waitlist?.submission_count ?? 0);

    if (!Number.isSafeInteger(totalCount) || totalCount < 0) {
      return json({ available: false }, 502);
    }

    return json({ available: true, totalCount });
  } catch {
    return json({ available: false }, 502);
  }
}

export const config = {
  path: "/api/waitlist-count",
};
