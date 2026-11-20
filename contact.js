export async function onRequestPost({request, env}) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim().slice(0,100);
    const email = String(body.email || '').trim().slice(0,160);
    const phone = String(body.phone || '').trim().slice(0,30);
    const message = String(body.message || '').trim();
    if (!name || (!email && !phone) || !message || message.length > 1500) {
      return Response.json({error:'Please enter your name, a phone or email, and a message (max 1500 characters).'}, {status:400});
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({error:'Please enter a valid email.'},{status:400});
    await env.DB.prepare('INSERT INTO contact_enquiries (name,email,phone,message) VALUES (?,?,?,?)')
      .bind(name,email||null,phone||null,message).run();
    return Response.json({message:'Your enquiry has been received. The clinic can contact you using the details provided.'},{status:201});
  } catch { return Response.json({error:'Unable to send your enquiry right now.'},{status:400}); }
}
