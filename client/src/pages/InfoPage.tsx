import { ArrowLeft, Mail, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";

const LOGO_URL = "/assets/taaluka-logo.png";

type PageKind = "about" | "privacy" | "terms" | "contact";

const pageMeta: Record<PageKind, { kicker: string; title: string }> = {
  about: { kicker: "ABOUT US", title: "About Us — Taaluka" },
  privacy: { kicker: "YOUR PRIVACY MATTERS", title: "Privacy Policy" },
  terms: { kicker: "PLEASE READ", title: "Terms and Conditions" },
  contact: { kicker: "WE ARE HERE TO HELP", title: "Contact Us" },
};

function PageFrame({
  kind,
  children,
}: {
  kind: PageKind;
  children: ReactNode;
}) {
  const meta = pageMeta[kind];

  return (
    <div className="info-page">
      <header className="info-header">
        <Link href="/" className="info-brand" aria-label="Taaluka home">
          <img src={LOGO_URL} alt="Taaluka" />
        </Link>
        <Link href="/" className="info-back">
          <ArrowLeft size={15} /> Back to Taaluka
        </Link>
      </header>
      <main className="info-main">
        <div className="info-hero">
          <span className="section-kicker">{meta.kicker}</span>
          <h1>{meta.title}</h1>
          {kind === "about" && <p>आपल्या तालुक्याचं, आपलं ॲप!</p>}
          {kind === "terms" && <p>Last Updated: 25 October 2026</p>}
        </div>
        <article className="info-content">{children}</article>
      </main>
      <footer className="info-footer">
        <div>
          <img src={LOGO_URL} alt="Taaluka" />
          <span>Our Taaluka. Our App. Our People.</span>
        </div>
        <nav aria-label="Policy pages">
          <Link href="/about">About Us</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
      </footer>
    </div>
  );
}

function AboutPage() {
  return (
    <PageFrame kind="about">
      <p>
        Taaluka is a local discovery platform built to bring the people,
        businesses, services and opportunities of our Taaluka together in one
        place.
      </p>
      <p>
        Our goal is to make it easier for people to discover local businesses,
        find services, explore job opportunities, access offers, stay updated on
        local events and connect with their community.
      </p>
      <p>
        We believe every local business deserves visibility and every resident
        deserves easier access to useful local information. By bringing local
        needs and opportunities together, Taaluka aims to support local growth
        and strengthen community connections.
      </p>
      <div className="info-highlight">
        <h2>Our Vision</h2>
        <p>To create a connected, informed and empowered local community.</p>
        <h2>Our Mission</h2>
        <p>
          To make discovering local information simple, accessible and
          convenient for everyone.
        </p>
      </div>
      <p className="info-signoff">
        Taaluka — Our Taaluka. Our App. Our People.
      </p>
    </PageFrame>
  );
}

function PrivacyPage() {
  return (
    <PageFrame kind="privacy">
      <p>
        Taaluka is a local discovery and community app that helps users discover
        businesses, services, jobs, offers, events and local updates within
        their Taaluka.
      </p>
      <p>
        This Privacy Policy explains how Taaluka collects, uses and protects
        personal information when you use our app.
      </p>
      <InfoSection title="Information We Collect">
        <ul>
          <li>
            <strong>Account information:</strong> If you register or log in, we
            collect your mobile number and OTP verification information. You may
            also provide your name, profile details or other information.
          </li>
          <li>
            <strong>Guest access:</strong> You can browse available features
            without creating an account. However, certain features may require
            login.
          </li>
          <li>
            <strong>Location:</strong> If you grant location permission, we may
            use your device location to provide relevant local information.
            Where available, you can select your area manually.
          </li>
          <li>
            <strong>Business listings and content:</strong> Business owners and
            users may submit business details, contact information, photographs,
            ratings, reviews, job listings, offers and event information.
          </li>
          <li>
            <strong>Technical information:</strong> We may collect device, app
            usage, diagnostic and security information through the app and its
            service providers, depending on the features and integrations used.
          </li>
        </ul>
      </InfoSection>
      <InfoSection title="How We Use Information">
        <ul>
          <li>Provide and manage user accounts and OTP verification.</li>
          <li>
            Display relevant local businesses, services, jobs, offers and
            events.
          </li>
          <li>Manage business listings, ratings and reviews.</li>
          <li>
            Send essential service notifications and permitted promotional
            messages.
          </li>
          <li>Display business promotions and advertisements.</li>
          <li>
            Maintain app security, troubleshoot errors and improve our services.
          </li>
          <li>Respond to requests and comply with applicable laws.</li>
        </ul>
      </InfoSection>
      <InfoSection title="Public Content and Sharing">
        <p>
          Business listings, contact details, reviews, ratings, offers, job
          advertisements and other content submitted for public display may be
          visible to other users.
        </p>
        <p>
          Please do not publish private or sensitive information in public
          content.
        </p>
        <p>
          We do not sell personal information as a standalone product. We may
          share necessary information with service providers that support
          hosting, databases, OTP delivery, image storage, notifications,
          analytics and other app functions.
        </p>
        <p>
          Information may also be disclosed where legally required. When you
          contact a business through phone, WhatsApp or an external website,
          that third party may process information you provide under its own
          privacy policy.
        </p>
      </InfoSection>
      <InfoSection title="Promotions, Payments and Security">
        <p>
          Taaluka may display local business promotions, sponsored placements
          and advertisements.
        </p>
        <p>
          At present, Taaluka does not provide an integrated in-app payment
          gateway for users to purchase goods or services through the app. If
          payment processing or additional features are introduced in the
          future, we will update our policies and provide any notices or consent
          required by law.
        </p>
        <p>
          We take reasonable measures to protect personal information against
          unauthorised access, loss, misuse or disclosure. We retain personal
          information only as long as reasonably necessary for the purposes
          described in this Policy, subject to applicable legal obligations. No
          method of electronic storage or transmission is completely secure.
        </p>
      </InfoSection>
      <InfoSection title="Your Choices and Updates">
        <p>
          If you create an account, you may request account deletion through the
          available in-app feature or the external deletion request method
          provided by Taaluka, where applicable. We will process deletion
          requests in accordance with applicable law. Certain information may
          need to be retained for legal or security purposes.
        </p>
        <p>
          Subject to applicable law, you may also request correction or deletion
          of personal information, withdraw consent where applicable, and raise
          privacy complaints. We handle children's personal information in
          accordance with applicable Indian law, including any applicable
          parental consent requirements.
        </p>
        <p>
          We may update this Privacy Policy when our services or legal
          obligations change. The latest version will be published through the
          app or our website with an updated date.
        </p>
      </InfoSection>
      <ContactDetails />
    </PageFrame>
  );
}

function TermsPage() {
  return (
    <PageFrame kind="terms">
      <InfoSection title="1. Acceptance of Terms">
        <p>
          By accessing or using Taaluka (“App”), you agree to these Terms and
          Conditions. If you disagree, please discontinue using the App.
        </p>
      </InfoSection>
      <InfoSection title="2. About Taaluka">
        <p>
          Taaluka is a local discovery platform that helps users find
          businesses, services, jobs, offers, events and community updates. Some
          features may require mobile number verification through OTP, while
          certain content may be accessible without login.
        </p>
      </InfoSection>
      <InfoSection title="3. Accuracy of Information">
        <p>
          Business listings, job vacancies, offers, reviews and other
          information may be provided by third parties. Taaluka does not
          guarantee their accuracy, authenticity, availability or completeness.
          Users should verify important details independently.
        </p>
      </InfoSection>
      <InfoSection title="4. User Responsibilities">
        <p>
          You agree to provide accurate information and not post fake listings,
          fraudulent offers, misleading reviews, abusive content, unlawful
          material or content that violates another person's rights. You must
          not misuse accounts, OTPs or the Platform.
        </p>
      </InfoSection>
      <InfoSection title="5. Business Listings and Advertisements">
        <p>
          Businesses are responsible for the accuracy of their listings,
          advertisements, prices, offers and services. Taaluka may display
          promotional content but does not automatically endorse or guarantee
          any advertised business.
        </p>
      </InfoSection>
      <InfoSection title="6. Jobs, Offers and Third-Party Services">
        <p>
          Taaluka does not guarantee employment, offer validity or service
          quality. Transactions, payments, bookings and agreements with
          third-party businesses are between the relevant parties. As of this
          date, Taaluka does not provide an integrated in-app payment gateway
          for purchasing third-party goods or services.
        </p>
      </InfoSection>
      <InfoSection title="7. Ratings and Reviews">
        <p>
          Reviews should reflect genuine experiences and must not contain false,
          abusive, defamatory or unlawful content. Taaluka may remove content
          that violates these Terms or applicable law.
        </p>
      </InfoSection>
      <InfoSection title="8. Intellectual Property">
        <p>
          Taaluka's name, logo, design and original content may not be copied,
          misused or commercially reproduced without authorization. Users must
          have the necessary rights to content they submit.
        </p>
      </InfoSection>
      <InfoSection title="9. Privacy">
        <p>
          Personal information is handled according to Taaluka's Privacy Policy
          and applicable Indian law. Users should avoid publishing sensitive or
          confidential information publicly.
        </p>
      </InfoSection>
      <InfoSection title="10. Suspension and Availability">
        <p>
          Taaluka may remove content, restrict accounts or modify features where
          reasonably necessary for security, legal compliance or violations of
          these Terms. We do not guarantee uninterrupted availability of the
          App.
        </p>
      </InfoSection>
      <InfoSection title="11. Disclaimer and Liability">
        <p>
          Taaluka is a discovery platform, not the direct provider of listed
          third-party services. To the extent permitted by law, we are not
          responsible for third-party conduct or inaccurate listings. Nothing in
          these Terms excludes liability or rights that cannot legally be
          excluded.
        </p>
      </InfoSection>
      <InfoSection title="12. Changes and Governing Law">
        <p>
          We may update these Terms from time to time. Continued use after
          changes take effect constitutes acceptance to the extent permitted by
          law. These Terms are governed by the laws of India, subject to
          applicable legal rights and jurisdiction.
        </p>
      </InfoSection>
    </PageFrame>
  );
}

function ContactPage() {
  return (
    <PageFrame kind="contact">
      <p>
        For privacy-related questions, data requests or complaints, please
        contact:
      </p>
      <ContactDetails />
    </PageFrame>
  );
}

function ContactDetails() {
  return (
    <div className="info-contact-card">
      <h2>Contact Taaluka</h2>
      <p>
        <strong>App Name:</strong> Taaluka
      </p>
      <p>
        <strong>Developer / Legal Entity:</strong> Adarsh Sujata (Ughade)
      </p>
      <a href="mailto:taaluka.app@gmail.com">
        <Mail size={16} /> taaluka.app@gmail.com
      </a>
      <p>
        <MapPin size={16} /> Akole, Ahilyanagar, Maharashtra – 422601
      </p>
      <small>We will handle requests in accordance with applicable law.</small>
    </div>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="info-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function AboutPageRoute() {
  return <AboutPage />;
}

export function PrivacyPageRoute() {
  return <PrivacyPage />;
}

export function TermsPageRoute() {
  return <TermsPage />;
}

export function ContactPageRoute() {
  return <ContactPage />;
}
