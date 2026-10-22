import Image from "next/image";
import { Fragment } from "react";
import { Mail, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getTranslations, type Locale } from "@/lib/i18n";
import { siteImages } from "@/lib/site-images";

const directions = "https://www.google.com/maps/dir/?api=1&destination=Aburii+TTDI%2C+5+Lorong+Datuk+Sulaiman+7%2C+Kuala+Lumpur";

function Lines({ text }: { text: string }) {
  return <>{text.split("\n").map((line, index) => <Fragment key={`${line}-${index}`}>{index > 0 && <br />}{line}</Fragment>)}</>;
}

export function VisitPage({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);

  return (
    <main className={locale === "zh" ? "locale-zh" : undefined} lang={locale === "zh" ? "zh-CN" : "en"}>
      <SiteNav locale={locale} />
      <section className="page-hero">
        <div className="page-hero-copy"><p className="eyebrow">{t.visit.eyebrow}</p><h1><Lines text={t.visit.title} /></h1><p className="page-hero-sub">{t.visit.intro}</p></div>
        <div className="page-hero-image"><Image className="cover visit-hero-img image-warm" src={siteImages.entrance} alt="" fill priority sizes="(max-width: 900px) 100vw, 65vw" /></div>
      </section>
      <section className="visit-details">
        <div className="visit-info">
          <p className="eyebrow">{t.visit.location}</p><h2>ABURII TTDI</h2>
          <address className="address">5, Lorong Datuk Sulaiman 7<br />Taman Tun Dr Ismail<br />60000 Kuala Lumpur</address>
          <div className="contact-list"><a href="tel:+60109100267"><Phone size={18} />+6010 910 0267</a><a href="mailto:aburiittdi@gmail.com"><Mail size={18} />aburiittdi@gmail.com</a></div>
          <div className="social-row"><a className="social-link" href="https://www.instagram.com/aburii.kl/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram aria-hidden="true" /></a><a className="social-link" href="https://www.facebook.com/aburii.kl/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF aria-hidden="true" /></a></div>
          <div className="hours"><h3>{t.visit.hours}</h3><div className="hours-grid"><strong>{t.visit.monday}</strong><span>{t.visit.closed}</span><strong>{t.visit.weekdays}</strong><span>6:00 PM – 10:30 PM</span><strong>{t.visit.weekend}</strong><span>12:00 PM – 2:30 PM<br />6:00 PM – 10:30 PM</span></div><a className="solid-button" href={directions} target="_blank" rel="noopener noreferrer">{t.visit.directions}</a></div>
        </div>
        <div className="map-wrap"><iframe title={t.visit.mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Aburii%20TTDI%2C%205%20Lorong%20Datuk%20Sulaiman%207%2C%20Kuala%20Lumpur&output=embed" /></div>
      </section>
      <section className="visit-gallery" aria-label={t.visit.galleryLabel}>
        <div className="gallery-image gallery-one"><Image className="cover" src={siteImages.diningRoom} alt="" fill sizes="(max-width: 640px) 100vw, 33vw" /></div>
        <div className="gallery-image gallery-two"><Image className="cover" src={siteImages.entrance} alt="" fill sizes="(max-width: 640px) 100vw, 33vw" /></div>
        <div className="gallery-image gallery-three"><Image className="cover" src={siteImages.barAmbience} alt="" fill sizes="(max-width: 640px) 100vw, 33vw" /></div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
