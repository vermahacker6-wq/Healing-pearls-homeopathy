export async function onRequestGet({env}) {
  const {results=[]} = await env.DB.prepare("SELECT display_name,rating,message,created_at FROM feedback WHERE status='approved' AND consent_to_display=1 ORDER BY created_at DESC LIMIT 20").all();
  return Response.json({items:results});
}
