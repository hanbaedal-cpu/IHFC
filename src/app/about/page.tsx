import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { getPageContent } from "@/models/PageContent";
import { PublicShell } from "@/components/home/PublicShell";
import { SiteFooter } from "@/components/home/SiteFooter";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  await connectDB();
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPageContent("about"),
  ]);

  return (
    <main>
      <PublicShell settings={settings} activePath="/about">
        <section className="section">
          <div className="container" style={{ textAlign: "center", maxWidth: 900 }}>
            <div className="section-label">ABOUT US</div>
            <h1
              style={{
                fontFamily: "var(--font-display), serif",
                color: "var(--green-900)",
                fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)",
                lineHeight: 1.35,
                margin: "0.4rem auto 1rem",
              }}
            >
              {page.title || settings.aboutTitle}
            </h1>
            <p
              className="section-lead"
              style={{ marginInline: "auto", marginBottom: "2rem" }}
            >
              {page.body || settings.aboutBody}
            </p>
            <div className="stats" style={{ textAlign: "left" }}>
              <div className="stat">
                <strong>24h</strong>
                <span>상담·이송</span>
              </div>
              <div className="stat">
                <strong>4</strong>
                <span>빈소 운영</span>
              </div>
              <div className="stat">
                <strong>100%</strong>
                <span>요금 공개</span>
              </div>
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
