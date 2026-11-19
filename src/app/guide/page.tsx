import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { getPageContent } from "@/models/PageContent";
import { GUIDE_STEPS } from "@/lib/site-content";
import { PublicShell } from "@/components/home/PublicShell";
import { SiteFooter } from "@/components/home/SiteFooter";

export const dynamic = "force-dynamic";

export default async function GuidePage() {
  await connectDB();
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPageContent("guide"),
  ]);
  const phone = settings.phone || "032-500-0444";
  const tel = phone.replace(/\D/g, "");

  return (
    <main>
      <PublicShell settings={settings} activePath="/guide">
        <section className="section">
          <div className="container">
            <div className="section-label">GUIDE</div>
            <h1 style={{ fontFamily: "var(--font-display), serif", color: "var(--green-900)" }}>
              {page.title}
            </h1>
            <p className="section-lead">{page.body}</p>
            <div className="steps">
              {GUIDE_STEPS.map((step) => (
                <article key={step.title} className="step-card">
                  <div className="meta">{step.meta}</div>
                  <h3 style={{ margin: 0 }}>{step.title}</h3>
                  <ul>
                    {step.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="panel" style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <p style={{ marginTop: 0 }}>장례 절차와 빈소 이용이 궁금하실 때</p>
              <h3 style={{ marginTop: 0 }}>24시간 전문 장례지도사가 안내해 드립니다</h3>
              <a className="btn btn-primary" href={`tel:${tel}`}>
                {phone}
              </a>
            </div>
          </div>
        </section>
        <SiteFooter
          siteName={settings.siteName}
          address={settings.address}
          phone={settings.phone}
        />
      </PublicShell>
    </main>
  );
}
