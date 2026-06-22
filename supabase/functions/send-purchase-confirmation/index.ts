import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return unauthorized();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return unauthorized();

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // Also allow Stripe webhook calls with a shared secret (no role check)
    const stripeSecret = req.headers.get("x-webhook-secret");
    const isStripeWebhook = stripeSecret && stripeSecret === Deno.env.get("WEBHOOK_SECRET");

    if (profile?.role !== "admin" && !isStripeWebhook) return forbidden();

    const { student_name, student_email, course_title, course_slug } = await req.json();
    if (!student_name || !student_email || !course_title || !course_slug) {
      throw new Error("student_name, student_email, course_title, and course_slug are required");
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");

    const FROM = `Academia Creativa <${Deno.env.get("RESEND_FROM_EMAIL") ?? "no-reply@academiacreativa.com"}>`;
    const courseUrl = `https://creativos-gamma.vercel.app/cursos/${course_slug}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [student_email],
        subject: `Confirmación de matrícula — ${course_title}`,
        html: confirmationHtml(student_name, student_email, course_title, courseUrl),
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: res.ok ? 200 : 500,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    headers: { "Content-Type": "application/json" },
    status: 401,
  });
}

function forbidden() {
  return new Response(JSON.stringify({ error: "Forbidden" }), {
    headers: { "Content-Type": "application/json" },
    status: 403,
  });
}

function confirmationHtml(name: string, email: string, courseTitle: string, courseUrl: string): string {
  const firstName = name.split(" ")[0];
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Confirmación de matrícula</title>
</head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff">

    <div style="background:#0A0A0A;padding:32px 40px">
      <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#EAE6DE;letter-spacing:0.05em">AcademiaCreativa</p>
      <p style="margin:5px 0 0;font-family:'Courier New',monospace;font-size:10px;color:#9E9B96;letter-spacing:0.3em;text-transform:uppercase">Escuela de Diseño Gráfico</p>
    </div>

    <div style="padding:52px 40px 40px">
      <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:11px;color:#C8420D;letter-spacing:0.25em;text-transform:uppercase">Matrícula confirmada</p>
      <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:34px;font-weight:normal;color:#0A0A0A;line-height:1.25">
        ${firstName}, ya tienes acceso.
      </h1>
      <p style="margin:0 0 28px;font-family:'Courier New',monospace;font-size:13px;color:#C8420D;letter-spacing:0.1em">${courseTitle}</p>

      <p style="margin:0 0 18px;font-size:15px;color:#3a3a3a;line-height:1.75">
        Tu matrícula en <strong>${courseTitle}</strong> está confirmada. Ya puedes acceder a todo el contenido del curso: lecciones, materiales y seguimiento de tu progreso.
      </p>
      <p style="margin:0 0 36px;font-size:15px;color:#3a3a3a;line-height:1.75">
        Cuando estés listo, entra directamente desde el botón de abajo.
      </p>

      <a href="${courseUrl}"
         style="display:inline-block;background:#C8420D;color:#ffffff;text-decoration:none;padding:15px 36px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.25em;text-transform:uppercase">
        Acceder al curso
      </a>
    </div>

    <div style="border-top:1px solid #e5e5e0;padding:24px 40px;background:#fafaf8">
      <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:#9E9B96;letter-spacing:0.08em">Academia Creativa · Escuela de Diseño Gráfico</p>
      <p style="margin:6px 0 0;font-family:'Courier New',monospace;font-size:10px;color:#b0aca6">Este email se envió a ${email} como confirmación de tu inscripción.</p>
    </div>

  </div>
</body>
</html>`;
}
