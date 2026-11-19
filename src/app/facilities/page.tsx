import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { getPageContent } from "@/models/PageContent";
import { FACILITIES } from "@/lib/site-content";
import { PublicShell } from "@/components/home/PublicShell";
import { SiteFooter } from "@/components/home/SiteFooter";
import { FacilityGallery } from "@/components/home/FacilityGallery";

export const dynamic = "force-dynamic";

export default async function FacilitiesPage() {
  await connectDB();
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPageContent("facilities"),
  ]);

  return (
    <main>
      <PublicShell settings={settings} activePath="/facilities">
        <section className="section" style={{ background: "#fff" }}>
          <div className="container">
            <div className="section-label">FACILITIES</div>
            <h1
              style={{
                fontFamily: "var(--font-display), serif",
                color: "var(--green-900)",
                marginTop: 0,
              }}
            >
              {page.title || "시설안내"}
            </h1>
            <p className="section-lead">
              {page.body ||
                "빈소 4실과 입관실·안치실·샤워실·유족 휴게실·조리실을 갖추어 장례 전 과정을 한 곳에서 모십니다."}
            </p>
            <FacilityGallery facilities={FACILITIES} />
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
