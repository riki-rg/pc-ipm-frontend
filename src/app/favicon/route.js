const API_ORIGIN = 'https://pc-ipm-mayong.web.id';
const ALLOWED_LOGO_HOSTS = new Set([
  'pc-ipm-mayong.web.id',
  'pimpinan.pc-ipm-mayong.web.id',
]);

export async function GET() {
  try {
    const settingsResponse = await fetch(`${API_ORIGIN}/api/pengaturan`, { cache: 'no-store' });
    if (!settingsResponse.ok) throw new Error(`Settings API returned ${settingsResponse.status}`);
    const settingsPayload = await settingsResponse.json();
    const logoUrl = settingsPayload?.data?.logo_url;
    if (!logoUrl) throw new Error('No logo_url configured');

    const resolvedUrl = new URL(logoUrl, API_ORIGIN);
    if (!ALLOWED_LOGO_HOSTS.has(resolvedUrl.hostname)) throw new Error('Unexpected logo host');

    const imageResponse = await fetch(resolvedUrl, { cache: 'no-store' });
    if (!imageResponse.ok) throw new Error(`Logo returned ${imageResponse.status}`);
    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    return new Response(imageResponse.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Favicon could not be loaded from website settings:', error);
    return Response.redirect(`${API_ORIGIN}/favicon.ico`, 302);
  }
}
