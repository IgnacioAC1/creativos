const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email } = await req.json();
    if (!name || !email) throw new Error("name and email are required");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");

    const FROM = `Academia Creativa <${Deno.env.get("RESEND_FROM_EMAIL") ?? "bienvenida@academiacreativa.com"}>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: `${name.split(" ")[0]}, tu cuenta en Academia Creativa está lista`,
        html: welcomeHtml(name, email),
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

function welcomeHtml(name: string, email: string): string {
  const firstName = name.split(" ")[0];
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Bienvenido a Academia Creativa</title>
</head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff">

    <div style="background:#0A0A0A;padding:32px 40px">
      <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#EAE6DE;letter-spacing:0.05em">AcademiaCreativa</p>
      <p style="margin:5px 0 0;font-family:'Courier New',monospace;font-size:10px;color:#9E9B96;letter-spacing:0.3em;text-transform:uppercase">Escuela de Diseño Gráfico</p>
    </div>

    <div style="padding:52px 40px 40px">
      <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:11px;color:#C8420D;letter-spacing:0.25em;text-transform:uppercase">Bienvenido</p>
      <h1 style="margin:0 0 28px;font-family:Georgia,serif;font-size:34px;font-weight:normal;color:#0A0A0A;line-height:1.25">
        ${firstName}, ya eres<br>parte de la escuela.
      </h1>
      <p style="margin:0 0 18px;font-size:15px;color:#3a3a3a;line-height:1.75">
        En Academia Creativa no enseñamos software — enseñamos criterio. Cada programa está diseñado para que desarrolles una forma de ver y resolver que te diferencie.
      </p>
      <p style="margin:0 0 36px;font-size:15px;color:#3a3a3a;line-height:1.75">
        Explora los cursos disponibles y empieza cuando estés listo.
      </p>
      <a href="https://creativos-gamma.vercel.app/cursos"
         style="display:inline-block;background:#C8420D;color:#ffffff;text-decoration:none;padding:15px 36px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.25em;text-transform:uppercase">
        Ver cursos
      </a>
    </div>

    <div style="border-top:1px solid #e5e5e0;padding:24px 40px;background:#fafaf8">
      <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:#9E9B96;letter-spacing:0.08em">Academia Creativa · Escuela de Diseño Gráfico</p>
      <p style="margin:6px 0 0;font-family:'Courier New',monospace;font-size:10px;color:#b0aca6">Este email se envió a ${email} porque creaste una cuenta en academiacreativa.com</p>
    </div>

  </div>
</body>
</html>`;
}
