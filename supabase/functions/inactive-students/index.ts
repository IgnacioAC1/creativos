import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COURSE_NAMES: Record<string, string> = {
  "identidad-visual": "Identidad Visual",
  "tipografia-editorial": "Tipografía & Editorial",
  "diseno-web-digital": "Diseño Web Digital",
  "direccion-de-arte": "Dirección de Arte",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return respond(401, { error: "Unauthorized" });

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
    if (!user) return respond(401, { error: "Unauthorized" });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") return respond(403, { error: "Forbidden" });

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const days = body.days ?? 14;
    const send = body.send === true;

    // Fetch inactive students via SQL function
    const { data: students, error } = await supabase.rpc("get_inactive_students", {
      days_threshold: days,
    });

    if (error) throw new Error(error.message);

    if (!send) {
      return respond(200, { students: students ?? [] });
    }

    // Send reminder emails
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");
    const FROM = `Academia Creativa <${Deno.env.get("RESEND_FROM_EMAIL") ?? "no-reply@academiacreativa.com"}>`;

    let sent = 0;
    for (const s of students ?? []) {
      const courseTitle = COURSE_NAMES[s.course_slug] ?? s.course_slug;
      const courseUrl = `https://creativos-gamma.vercel.app/cursos/${s.course_slug}`;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM,
          to: [s.user_email],
          subject: `${s.user_name.split(" ")[0]}, tu curso ${courseTitle} te está esperando`,
          html: reminderHtml(s.user_name, s.user_email, courseTitle, courseUrl, s.last_activity),
        }),
      });

      if (res.ok) sent++;
    }

    return respond(200, { students: students ?? [], sent });
  } catch (err) {
    return respond(500, { error: (err as Error).message });
  }
});

function respond(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}

function reminderHtml(
  name: string,
  email: string,
  courseTitle: string,
  courseUrl: string,
  lastActivity: string | null,
): string {
  const firstName = name.split(" ")[0];
  const lastSeen = lastActivity
    ? new Date(lastActivity).toLocaleDateString("es-ES", { day: "numeric", month: "long" })
    : null;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Te echamos de menos</title>
</head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff">

    <div style="background:#0A0A0A;padding:32px 40px">
      <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#EAE6DE;letter-spacing:0.05em">AcademiaCreativa</p>
      <p style="margin:5px 0 0;font-family:'Courier New',monospace;font-size:10px;color:#9E9B96;letter-spacing:0.3em;text-transform:uppercase">Escuela de Diseño Gráfico</p>
    </div>

    <div style="padding:52px 40px 40px">
      <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:11px;color:#C8420D;letter-spacing:0.25em;text-transform:uppercase">Recordatorio</p>
      <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:34px;font-weight:normal;color:#0A0A0A;line-height:1.25">
        ${firstName}, tu curso<br>te está esperando.
      </h1>
      <p style="margin:0 0 28px;font-family:'Courier New',monospace;font-size:13px;color:#C8420D;letter-spacing:0.1em">${courseTitle}</p>

      <p style="margin:0 0 18px;font-size:15px;color:#3a3a3a;line-height:1.75">
        Tienes acceso a <strong>${courseTitle}</strong> pero llevas un tiempo sin pasar por aquí.${lastSeen ? ` Tu última actividad fue el ${lastSeen}.` : ""} No hace falta grandes bloques de tiempo — retomar desde donde lo dejaste es suficiente.
      </p>
      <p style="margin:0 0 36px;font-size:15px;color:#3a3a3a;line-height:1.75">
        Cuando quieras continuar, aquí te dejamos el acceso directo.
      </p>

      <a href="${courseUrl}"
         style="display:inline-block;background:#C8420D;color:#ffffff;text-decoration:none;padding:15px 36px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.25em;text-transform:uppercase">
        Continuar el curso
      </a>
    </div>

    <div style="border-top:1px solid #e5e5e0;padding:24px 40px;background:#fafaf8">
      <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:#9E9B96;letter-spacing:0.08em">Academia Creativa · Escuela de Diseño Gráfico</p>
      <p style="margin:6px 0 0;font-family:'Courier New',monospace;font-size:10px;color:#b0aca6">Este email se envió a ${email} porque tienes un curso activo. Si no deseas recibir recordatorios, ignora este mensaje.</p>
    </div>

  </div>
</body>
</html>`;
}
