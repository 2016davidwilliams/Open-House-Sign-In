import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
serve(async (req) => {
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== Deno.env.get("WEBHOOK_SECRET")) return new Response("Unauthorized", { status: 401 });
  const payload = await req.json();
  const lead = payload.record;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}` },
    body: JSON.stringify({
      from: Deno.env.get("FROM_EMAIL"),
      to: [Deno.env.get("NOTIFICATION_EMAIL")],
      subject: `New real estate lead: ${lead.full_name}`,
      html: `<h2>New lead submission</h2><p><b>Name:</b> ${lead.full_name}</p><p><b>Email:</b> ${lead.email ?? ""}</p><p><b>Phone:</b> ${lead.phone ?? ""}</p><p><b>Needs:</b> ${(lead.current_needs ?? []).join(", ")}</p><p><b>Source:</b> ${lead.source}</p>`
    })
  });
  return new Response(await response.text(), { status: response.status, headers: { "Content-Type": "application/json" } });
});
