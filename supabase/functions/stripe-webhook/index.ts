import Stripe from "https://esm.sh/stripe@14.21.0?target=deno&no-check";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2024-04-10",
    httpClient: Stripe.createFetchHttpClient(),
  });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (err) {
    console.error("Webhook signature error:", err);
    return new Response(
      JSON.stringify({ error: `Webhook error: ${(err as Error).message}` }),
      { headers: { "Content-Type": "application/json" }, status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { course_slug, course_title, user_id, user_email, user_name } = session.metadata!;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error: enrollError } = await supabase
      .from("enrollments")
      .insert({ user_id, course_slug, enrolled_at: new Date().toISOString() });

    if (enrollError && enrollError.code !== "23505") {
      console.error("Error insertando matrícula:", enrollError);
      return new Response(
        JSON.stringify({ error: enrollError.message }),
        { headers: { "Content-Type": "application/json" }, status: 500 },
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
    const FROM = `Academia Creativa <${Deno.env.get("RESEND_FROM_EMAIL") ?? "no-reply@academiacreativa.com"}>`;
    const courseUrl = `https://creativos-gamma.vercel.app/cursos/${course_slug}`;
    const firstName = user_name ? user_name.split(" ")[0] : "Alumno";

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [user_email],
        subject: `Confirmación de matrícula — ${course_title}`,
        html: confirmationHtml(firstName, user_email, course_title, courseUrl),
      }),
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});

function confirmationHtml(firstName: string, email: string, courseTitle: string, courseUrl: string): string {
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
