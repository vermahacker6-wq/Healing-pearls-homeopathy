function authorized(request, env) {
  const expected = env.ADMIN_API_TOKEN;
  const supplied = request.headers.get('Authorization') || '';
  return Boolean(expected && supplied === `Bearer ${expected}`);
}
export async function onRequestGet({request, env}) {
  if (!authorized(request,env)) return Response.json({error:'Unauthorized'},{status:401});
  const {results=[]} = await env.DB.prepare('SELECT id,display_name,rating,message,consent_to_display,status,created_at FROM feedback ORDER BY created_at DESC LIMIT 200').all();
  return Response.json({items:results});
}
export async function onRequestPatch({request, env}) {
  if (!authorized(request,env)) return Response.json({error:'Unauthorized'},{status:401});
  try {
    const {id,status} = await request.json();
    if (!Number.isInteger(Number(id)) || !['approved','rejected','pending'].includes(status)) return Response.json({error:'Invalid update'},{status:400});
    await env.DB.prepare('UPDATE feedback SET status=? WHERE id=?').bind(status,Number(id)).run();
    return Response.json({message:'Updated'});
  } catch { return Response.json({error:'Unable to update feedback'},{status:400}); }
}
export async function onRequestDelete({request, env}) {
  if (!authorized(request,env)) return Response.json({error:'Unauthorized'},{status:401});
  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isInteger(id) || id < 1) return Response.json({error:'Invalid id'},{status:400});
  await env.DB.prepare('DELETE FROM feedback WHERE id=?').bind(id).run();
  return Response.json({message:'Deleted'});
}
