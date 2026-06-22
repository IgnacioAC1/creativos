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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return unauthorized();

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return unauthorized();

    const { student_name, student_email, course_title, course_slug, issued_at } = await req.json();
    if (!student_name || !student_email || !course_title || !course_slug || !issued_at) {
      throw new Error("student_name, student_email, course_title, course_slug, and issued_at are required");
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");

    const FROM = `Academia Creativa <${Deno.env.get("RESEND_FROM_EMAIL") ?? "certificados@academiacreativa.com"}>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [student_email],
        subject: `Tu certificado de ${course_title} — AcademiaCreativa`,
        html: certificateHtml(student_name, student_email, course_title, course_slug, issued_at),
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

function certificateHtml(
  name: string,
  email: string,
  courseTitle: string,
  courseSlug: string,
  issuedAt: string,
): string {
  const firstName = name.split(" ")[0];
  const dateStr = formatDate(issuedAt);
  const courseUrl = `https://creativos-gamma.vercel.app/cursos/${courseSlug}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Certificado — ${courseTitle}</title>
</head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff">

    <div style="background:#0A0A0A;padding:32px 40px">
      <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#EAE6DE;letter-spacing:0.05em">AcademiaCreativa</p>
      <p style="margin:5px 0 0;font-family:'Courier New',monospace;font-size:10px;color:#9E9B96;letter-spacing:0.3em;text-transform:uppercase">Escuela de Diseño Gráfico</p>
    </div>

    <div style="padding:52px 40px 40px">
      <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:11px;color:#C8420D;letter-spacing:0.25em;text-transform:uppercase">Certificado de finalización</p>
      <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:34px;font-weight:normal;color:#0A0A0A;line-height:1.25">
        ${firstName}, lo has conseguido.
      </h1>
      <p style="margin:0 0 36px;font-family:'Courier New',monospace;font-size:13px;color:#C8420D;letter-spacing:0.1em">${courseTitle}</p>

      <p style="margin:0 0 18px;font-size:15px;color:#3a3a3a;line-height:1.75">
        Has completado con éxito el curso <strong>${courseTitle}</strong>. Este certificado acredita que has superado todas las lecciones del programa.
      </p>
      <p style="margin:0 0 36px;font-size:15px;color:#3a3a3a;line-height:1.75">
        Fecha de emisión: <strong>${dateStr}</strong>
      </p>

      <div style="border:2px solid #0A0A0A;padding:36px;text-align:center;margin-bottom:36px;position:relative">
        <div style="position:absolute;inset:6px;border:1px solid #e0e0e0;pointer-events:none"></div>
        <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:18px;color:#111;letter-spacing:0.02em">AcademiaCreativa</p>
        <p style="margin:0 0 28px;font-family:'Courier New',monospace;font-size:8px;color:#9E9B96;letter-spacing:0.35em;text-transform:uppercase">Escuela de Diseño Gráfico</p>
        <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:9px;color:#888;letter-spacing:0.25em;text-transform:uppercase">Certificado de finalización</p>
        <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:9px;color:#888;letter-spacing:0.15em;text-transform:uppercase">Se certifica que</p>
        <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:26px;color:#111;font-weight:normal">${name}</p>
        <p style="margin:0 0 4px;font-size:13px;color:#555">ha completado con éxito el curso</p>
        <p style="margin:0 0 28px;font-family:Georgia,serif;font-size:16px;color:#111;font-weight:normal">${courseTitle}</p>
        <div style="width:40px;height:1px;background:#C8420D;margin:0 auto 20px"></div>
        <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;color:#888;letter-spacing:0.15em">${dateStr}</p>
      </div>

      <a href="${courseUrl}"
         style="display:inline-block;background:#C8420D;color:#ffffff;text-decoration:none;padding:15px 36px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.25em;text-transform:uppercase">
        Ver el curso
      </a>
    </div>

    <div style="border-top:1px solid #e5e5e0;padding:24px 40px;background:#fafaf8">
      <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:#9E9B96;letter-spacing:0.08em">Academia Creativa · Escuela de Diseño Gráfico</p>
      <p style="margin:6px 0 0;font-family:'Courier New',monospace;font-size:10px;color:#b0aca6">Este email se envió a ${email} como constancia de tu certificado.</p>
    </div>

  </div>
</body>
</html>`;
}
