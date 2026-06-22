import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { X, Award, Download, Mail } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { supabase } from "../../lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
  studentName: string;
  studentEmail: string;
  courseName: string;
  professorName: string;
  courseSlug: string;
}

const CERT_KEY = "ac_certificates";

function loadCertificates(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CERT_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

function buildCertificateHTML(
  studentName: string,
  courseName: string,
  professorName: string,
  dateStr: string
): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Certificado — ${courseName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Krona+One&family=Outfit:wght@300;400&family=DM+Mono:wght@400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Outfit', sans-serif; }
  .cert { width: 800px; padding: 60px 80px; border: 2px solid #000; text-align: center; position: relative; }
  .cert::before { content: ''; position: absolute; inset: 8px; border: 1px solid #ccc; pointer-events: none; }
  .logo-name { font-family: 'Krona One', sans-serif; font-size: 22px; color: #111; letter-spacing: -0.01em; margin-bottom: 2px; }
  .logo-sub { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase; color: #9E9B96; font-weight: 500; margin-bottom: 32px; }
  .heading { font-family: 'Krona One', sans-serif; font-size: 28px; font-weight: 400; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 32px; color: #111; }
  .label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #888; margin-bottom: 8px; }
  .student { font-family: 'Krona One', sans-serif; font-size: 36px; font-weight: 400; color: #111; margin-bottom: 24px; }
  .course-label { font-family: 'Outfit', sans-serif; font-size: 15px; color: #555; margin-bottom: 8px; }
  .course { font-family: 'Krona One', sans-serif; font-size: 22px; font-weight: 400; color: #111; margin-bottom: 8px; }
  .professor { font-family: 'Outfit', sans-serif; font-size: 14px; color: #555; margin-bottom: 40px; }
  .divider { width: 60px; height: 1px; background: #C8420D; margin: 0 auto 32px; }
  .date { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.2em; color: #888; }
  @media print { body { background: #fff; } .cert { border: 2px solid #000; } }
</style>
</head>
<body>
<div class="cert">
  <p class="logo-name">AcademiaCreativa</p>
  <p class="logo-sub">Escuela de Diseño Gráfico</p>
  <h1 class="heading">Certificado de Finalización</h1>
  <p class="label">Se certifica que</p>
  <p class="student">${studentName}</p>
  <p class="course-label">ha completado con éxito el curso</p>
  <p class="course">${courseName}</p>
  <p class="professor">impartido por ${professorName}</p>
  <div class="divider"></div>
  <p class="date">${dateStr}</p>
</div>
</body>
</html>`;
}

export default function CourseCompletionModal({
  open,
  onClose,
  studentName,
  studentEmail,
  courseName,
  professorName,
  courseSlug,
}: Props) {
  const [screen, setScreen] = useState<"congrats" | "certificate">("congrats");
  const [certDate, setCertDate] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setTimeout(() => setScreen("congrats"), 300);
      return;
    }

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ["#C8420D", "#EAE6DE", "#ffffff", "#ff6b35"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.5, x: 0.2 },
        colors: ["#C8420D", "#EAE6DE", "#ffffff"],
      });
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.5, x: 0.8 },
        colors: ["#C8420D", "#EAE6DE", "#ffffff"],
      });
    }, 400);
  }, [open]);

  useEffect(() => {
    if (screen !== "certificate") return;
    const certs = loadCertificates();
    if (!certs[courseSlug]) {
      const now = new Date().toISOString();
      localStorage.setItem(CERT_KEY, JSON.stringify({ ...certs, [courseSlug]: now }));
      setCertDate(now);
      supabase.functions.invoke("send-certificate", {
        body: {
          student_name: studentName,
          student_email: studentEmail,
          course_title: courseName,
          course_slug: courseSlug,
          issued_at: now,
        },
      });
    } else {
      setCertDate(certs[courseSlug]);
    }
  }, [screen, courseSlug]);

  function downloadCertificate() {
    const dateStr = certDate ? formatDate(certDate) : formatDate(new Date().toISOString());
    const html = buildCertificateHTML(studentName, courseName, professorName, dateStr);
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }

  const displayDate = certDate ? formatDate(certDate) : "";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-background border border-border p-0 max-w-2xl rounded-none overflow-hidden"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {screen === "congrats" ? (
          <div className="relative p-10 text-center">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border border-accent/40 flex items-center justify-center">
                <Award size={28} className="text-accent" />
              </div>
            </div>

            <span
              className="text-xs text-accent tracking-widest uppercase block mb-4"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Curso Completado
            </span>

            <h2
              style={{ fontFamily: "'Krona One', sans-serif", fontSize: "clamp(32px, 5vw, 52px)" }}
              className="font-light text-foreground leading-tight mb-3"
            >
              ¡Felicidades!
            </h2>

            <p className="text-base text-foreground mb-2">
              Has completado el curso con éxito.
            </p>
            <p className="text-sm text-muted-foreground mb-10">
              Te enviaremos el certificado a{" "}
              <span className="text-foreground">{studentEmail}</span>
            </p>

            <button
              onClick={() => setScreen("certificate")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Ver mi certificado
            </button>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setScreen("congrats")}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                ← Volver
              </button>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Certificate preview */}
            <div
              className="border-2 border-foreground/20 text-center py-12 px-10 mb-6 relative"
              style={{ background: "#fdfdfd", color: "#111" }}
            >
              <div
                className="absolute inset-2 border border-foreground/10 pointer-events-none"
              />
              <div className="mb-8">
                <p
                  style={{ fontFamily: "'Krona One', sans-serif", fontSize: "20px", color: "#111", letterSpacing: "-0.01em" }}
                >
                  AcademiaCreativa
                </p>
                <p
                  className="text-[9px] uppercase"
                  style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.4em", color: "#9E9B96", fontWeight: 500 }}
                >
                  Escuela de Diseño Gráfico
                </p>
              </div>
              <h3
                style={{ fontFamily: "'Krona One', sans-serif", fontSize: "18px", letterSpacing: "0.05em", color: "#111" }}
                className="uppercase mb-8 font-normal"
              >
                Certificado de Finalización
              </h3>
              <p
                className="text-xs tracking-widest uppercase mb-2"
                style={{ fontFamily: "'DM Mono', monospace", color: "#888" }}
              >
                Se certifica que
              </p>
              <p
                style={{ fontFamily: "'Krona One', sans-serif", fontSize: "clamp(18px, 3vw, 28px)", color: "#111" }}
                className="font-normal mb-5"
              >
                {studentName}
              </p>
              <p className="text-sm mb-1" style={{ color: "#555" }}>
                ha completado con éxito el curso
              </p>
              <p
                style={{ fontFamily: "'Krona One', sans-serif", fontSize: "16px", color: "#111" }}
                className="font-normal mb-1"
              >
                {courseName}
              </p>
              <p className="text-sm mb-6" style={{ color: "#555" }}>
                impartido por {professorName}
              </p>
              <div className="w-12 h-px bg-[#C8420D] mx-auto mb-5" />
              <p
                className="text-xs tracking-widest"
                style={{ fontFamily: "'DM Mono', monospace", color: "#888" }}
              >
                {displayDate}
              </p>
            </div>

            {/* Email confirmation banner */}
            <div className="flex items-center gap-3 px-4 py-3 bg-accent/10 border border-accent/30 mb-6">
              <Mail size={14} className="text-accent flex-shrink-0" />
              <p
                className="text-xs tracking-wide text-accent"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Certificado enviado a {studentEmail}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadCertificate}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                <Download size={13} />
                Descargar certificado (PDF)
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3.5 border border-border text-muted-foreground text-xs uppercase tracking-widest hover:text-foreground hover:border-foreground/30 transition-colors"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
