import Image from "next/image";
import { Fragment } from "react";
import { ReserveBand, SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getTranslations, type Locale } from "@/lib/i18n";
import { siteImages } from "@/lib/site-images";

function Lines({ text }: { text: string }) {
  return <>{text.split("\n").map((line, index) => <Fragment key={`${line}-${index}`}>{index > 0 && <br />}{line}</Fragment>)}</>;
}

export function AboutPage({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);

  return (
    <main className={`about-page${locale === "zh" ? " locale-zh" : ""}`} lang={locale === "zh" ? "zh-CN" : "en"}>
      <SiteNav locale={locale} />

      <section className="about-hero">
        <div className="about-hero-media">
          <Image src={siteImages.aboutFire} alt="" fill priority sizes="100vw" />
        </div>
        <div className="about-hero-shade" />
        <div className="about-hero-copy">
          <p className="eyebrow">{t.about.heroEyebrow}</p>
          <h1><Lines text={t.about.heroTitle} /></h1>
          <p className="about-hero-sub"><Lines text={t.about.heroSub} /></p>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-copy">
          <p className="eyebrow">{t.about.storyEyebrow}</p>
          <h2><Lines text={t.about.storyTitle} /></h2>
          <p>{t.about.storyBodyOne}</p>
          <p>{t.about.storyBodyTwo}</p>
        </div>
        <div className="about-story-media">
          <Image src={siteImages.diningRoom} alt="" fill sizes="(max-width: 900px) 100vw, 54vw" />
        </div>
      </section>

      <section className="about-philosophy">
        <div className="about-philosophy-head">
          <div>
            <p className="eyebrow">{t.about.philosophyEyebrow}</p>
            <h2><Lines text={t.about.philosophyTitle} /></h2>
          </div>
          <p>{t.about.philosophyBodyOne} {t.about.philosophyBodyTwo}</p>
        </div>

        <div className="about-values">
          <div className="about-value about-value-quality">
            <Image src={siteImages.wagyuPlatter} alt="" fill sizes="(max-width: 680px) 100vw, 33vw" />
            <h3>{t.about.quality}</h3>
          </div>
          <div className="about-value about-value-craft">
            <Image src={siteImages.binchotanCraft} alt="" fill sizes="(max-width: 680px) 100vw, 33vw" />
            <h3>{t.about.craft}</h3>
          </div>
          <div className="about-value about-value-experience">
            <Image src={siteImages.sakeService} alt="" fill sizes="(max-width: 680px) 100vw, 33vw" />
            <h3>{t.about.experience}</h3>
          </div>
        </div>
      </section>

      <section className="about-space">
        <div className="about-space-media">
          <Image src={siteImages.diningRoom} alt="" fill sizes="(max-width: 900px) 100vw, 58vw" />
        </div>
        <div className="about-space-copy">
          <p className="eyebrow">{t.about.spaceEyebrow}</p>
          <h2><Lines text={t.about.spaceTitle} /></h2>
          <p>{t.about.spaceBodyOne}</p>
          <p>{t.about.spaceBodyTwo}</p>
        </div>
      </section>

      <ReserveBand locale={locale} />
      <SiteFooter locale={locale} />
    </main>
  );
}
