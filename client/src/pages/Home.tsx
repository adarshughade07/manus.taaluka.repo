import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Instagram,
  Link2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const LOGO_URL = "/manus-storage/taaluka__1_-removebg-preview_cadf55b2.png";
const INSTAGRAM_URL =
  "https://www.instagram.com/taaluka.akole?utm_source=ig_web_button_share_sheet&srtk=ZDNlZDc0MzIxNw==";
const WHATSAPP_MESSAGE =
  "अकोल्यासाठी काहीतरी खास येतंय — Taaluka च्या early access मध्ये माझ्यासोबत या!";

function friendlyRegistrationError(message?: string) {
  if (!message) return undefined;
  if (/fetch|network|offline|failed to connect/i.test(message)) {
    return "Internet connection तपासा आणि पुन्हा प्रयत्न करा.";
  }
  if (/database|unavailable|temporarily/i.test(message)) {
    return "नोंदणी सेवा सध्या तात्पुरती unavailable आहे. थोड्या वेळाने पुन्हा प्रयत्न करा.";
  }
  return message;
}

async function submitToNetlify(name: string, mobile: string) {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname;
  const isNetlifyHost =
    host.endsWith(".netlify.app") || host.endsWith(".netlify.com");
  if (!isNetlifyHost) return true;

  const body = new URLSearchParams({
    "form-name": "taaluka-waitlist",
    name,
    mobile,
  });
  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    return response.ok;
  } catch {
    // The managed API remains the source of truth if Netlify capture is unavailable.
    return false;
  }
}

const benefits = [
  {
    number: "01",
    icon: MapPin,
    title: "आपल्या तालुक्याशी जोडलेले राहा",
    copy: "अकोले तालुक्यातील घडामोडी, community happenings आणि महत्त्वाची माहिती — अगदी जवळून.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "स्थानिक व्यवसायांना जाणून घ्या",
    copy: "आपली आवडती shops, services, offers आणि local businesses — एका digital ठिकाणी.",
  },
  {
    number: "03",
    icon: Zap,
    title: "सुरुवातीलाच सहभागी व्हा",
    copy: "लवकर register करा, मित्रांना invite करा आणि exclusive early-access benefits unlock करा.",
  },
];

type WaitlistStatus = {
  queuePosition: number;
  referralCode: string;
  referralLink: string;
  successfulReferrals: number;
  positionsGained: number;
  nextMilestone: { referrals: number; label: string } | null;
};

type FormProps = {
  onSubmit: (name: string, mobile: string) => void;
  isPending: boolean;
  error?: string;
  buttonLabel: string;
  compact?: boolean;
};

type FormErrors = {
  name?: string;
  mobile?: string;
};

function WaitlistForm({
  onSubmit,
  isPending,
  error,
  buttonLabel,
  compact = false,
}: FormProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const formId = compact ? "closing" : "hero";

  const validate = () => {
    const nextErrors: FormErrors = {};
    const trimmedName = name.trim();
    const trimmedMobile = mobile.trim();
    const digits = trimmedMobile.replace(/\D/g, "");
    const indianMobile =
      digits.length === 12 && digits.startsWith("91")
        ? digits.slice(2)
        : digits;

    if (trimmedName.length < 2) {
      nextErrors.name = "कृपया तुमचे नाव टाका.";
    } else if (!/\p{L}/u.test(trimmedName)) {
      nextErrors.name = "कृपया valid नाव टाका.";
    }

    if (
      !/^\+?[\d\s()-]+$/.test(trimmedMobile) ||
      !/^[6-9]\d{9}$/.test(indianMobile)
    ) {
      nextErrors.mobile = "कृपया 10 अंकी valid mobile number टाका.";
    }

    setFieldErrors(nextErrors);
    return { nextErrors, trimmedName };
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { nextErrors, trimmedName } = validate();
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(trimmedName, mobile.trim());
  };

  return (
    <form
      className={`waitlist-form ${compact ? "waitlist-form--compact" : ""}`}
      name="taaluka-waitlist"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      noValidate
      onSubmit={submit}
    >
      <input type="hidden" name="form-name" value="taaluka-waitlist" />
      <input type="hidden" name="bot-field" />
      <div className="form-field">
        <label className="sr-only" htmlFor={`${formId}-name`}>
          तुमचे नाव
        </label>
        <div
          className={`input-shell ${fieldErrors.name ? "input-shell--error" : ""}`}
        >
          <input
            id={`${formId}-name`}
            name="name"
            value={name}
            onChange={event => {
              setName(event.target.value);
              if (fieldErrors.name) {
                setFieldErrors(current => ({ ...current, name: undefined }));
              }
            }}
            placeholder="तुमचे नाव"
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={
              fieldErrors.name ? `${formId}-name-error` : undefined
            }
          />
        </div>
        {fieldErrors.name && (
          <p className="field-error" id={`${formId}-name-error`} role="alert">
            {fieldErrors.name}
          </p>
        )}
      </div>
      <div className="form-field">
        <label className="sr-only" htmlFor={`${formId}-mobile`}>
          Mobile number
        </label>
        <div
          className={`input-shell ${fieldErrors.mobile ? "input-shell--error" : ""}`}
        >
          <span className="input-prefix">+91</span>
          <input
            id={`${formId}-mobile`}
            name="mobile"
            value={mobile}
            onChange={event => {
              setMobile(event.target.value);
              if (fieldErrors.mobile) {
                setFieldErrors(current => ({ ...current, mobile: undefined }));
              }
            }}
            placeholder="Mobile number"
            autoComplete="tel"
            inputMode="tel"
            required
            aria-invalid={Boolean(fieldErrors.mobile)}
            aria-describedby={
              fieldErrors.mobile ? `${formId}-mobile-error` : undefined
            }
          />
        </div>
        {fieldErrors.mobile && (
          <p className="field-error" id={`${formId}-mobile-error`} role="alert">
            {fieldErrors.mobile}
          </p>
        )}
      </div>
      <button
        className="button button--primary"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "नोंदणी होत आहे…" : buttonLabel}
        {!isPending && <ArrowRight size={17} strokeWidth={2.2} />}
      </button>
      {error && (
        <p
          className="form-error"
          id={`${compact ? "closing" : "hero"}-form-error`}
          role="alert"
        >
          {error}
        </p>
      )}
      <p className="form-note">
        <ShieldCheck size={14} /> तुमची माहिती सुरक्षित राहील. फक्त Taaluka
        updates साठी.
      </p>
    </form>
  );
}

function ProgressPanel({
  status,
  onShare,
}: {
  status: WaitlistStatus;
  onShare: () => void;
}) {
  const milestoneProgress = status.nextMilestone
    ? Math.min(
        (status.successfulReferrals / status.nextMilestone.referrals) * 100,
        100
      )
    : 100;

  return (
    <div className="status-panel" id="share">
      <div className="status-panel__top">
        <div>
          <span className="section-kicker">तुमची जागा निश्चित झाली</span>
          <h3>
            तुम्ही <em>#{status.queuePosition}</em> क्रमांकावर आहात.
          </h3>
        </div>
        <div className="status-check">
          <Check size={18} />
        </div>
      </div>
      <div className="status-metrics">
        <div>
          <strong>{status.successfulReferrals}</strong>
          <span>successful referrals</span>
        </div>
        <div>
          <strong>+{status.positionsGained}</strong>
          <span>positions gained</span>
        </div>
        <div>
          <strong>#{status.referralCode}</strong>
          <span>तुमचा referral code</span>
        </div>
      </div>
      {status.nextMilestone && (
        <div className="milestone">
          <div className="milestone__copy">
            <span>Next milestone</span>
            <strong>{status.nextMilestone.label}</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${milestoneProgress}%` }} />
          </div>
          <span className="milestone__count">
            {status.successfulReferrals}/{status.nextMilestone.referrals}
          </span>
        </div>
      )}
      <div className="status-actions">
        <button className="button button--dark" type="button" onClick={onShare}>
          <MessageCircle size={17} /> WhatsApp वर share करा
        </button>
        <button
          className="button button--outline"
          type="button"
          onClick={onShare}
        >
          <Copy size={16} /> Link copy करा
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [status, setStatus] = useState<WaitlistStatus | null>(null);
  const [shareNotice, setShareNotice] = useState("");
  const referralCode = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return new URLSearchParams(window.location.search).get("ref") || undefined;
  }, []);
  const stats = trpc.waitlist.stats.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const registerMutation = trpc.waitlist.register.useMutation({
    onSuccess: data => {
      setStatus(data.status);
      try {
        window.localStorage.setItem(
          "taaluka_referral_code",
          data.status.referralCode
        );
      } catch {
        /* storage is optional */
      }
      stats.refetch();
      document
        .getElementById("share")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.success(
        data.isNew
          ? "अभिनंदन! तुम्ही Taaluka मध्ये जोडले गेले आहात."
          : "तुमची जागा आधीच सुरक्षित आहे."
      );
    },
  });

  const register = (name: string, mobile: string) => {
    setShareNotice("");
    registerMutation.mutate(
      { name, mobile, referralCode },
      {
        onSuccess: async () => {
          const netlifySaved = await submitToNetlify(name, mobile);
          if (!netlifySaved) {
            toast.warning("नोंदणी झाली; Netlify sync सध्या उपलब्ध नाही.");
          }
        },
      }
    );
  };

  const statsUnavailable = stats.isError || stats.data?.available === false;
  const registeredCount = statsUnavailable
    ? "—"
    : (stats.data?.totalCount ?? 0).toLocaleString("en-IN");

  const share = async () => {
    if (!status) {
      setShareNotice("आधी तुमची जागा निश्चित करा — मग मित्रांना invite करा.");
      document
        .getElementById("join")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const url = `${window.location.origin}${status.referralLink}`;
    const text = `${WHATSAPP_MESSAGE} ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Taaluka Early Access",
          text: WHATSAPP_MESSAGE,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(text);
      setShareNotice("तुमचा referral link copy झाला.");
      toast.success("Referral link copy झाला.");
    } catch {
      setShareNotice(
        "Share करण्यासाठी WhatsApp वापरा किंवा link पुन्हा copy करा."
      );
    }
  };

  const whatsappUrl = status
    ? `https://wa.me/?text=${encodeURIComponent(`${WHATSAPP_MESSAGE} ${window.location.origin}${status.referralLink}`)}`
    : "https://wa.me/";

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="Taaluka home">
          <img src={LOGO_URL} alt="Taaluka" />
          <span className="eyebrow">अकोले, महाराष्ट्र</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#why-taaluka">का Taaluka?</a>
          <a className="nav-cta" href="#join">
            माझी जागा निश्चित करा <ArrowRight size={15} />
          </a>
        </nav>
        <a
          className="mobile-nav-cta"
          href="#join"
          aria-label="Join early access"
        >
          <ArrowRight size={18} />
        </a>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" /> AKOLE • MAHARASHTRA
            </div>
            <h1>
              आपल्या अकोल्याचा
              <br />
              <span>हक्काचा डिजिटल</span>
              <br />
              प्लॅटफॉर्म!
            </h1>
            <p className="hero-tagline">आपल्या तालुक्याचे आपले ॲप</p>
            <p className="hero-subtitle">
              आपल्या तालुक्यातील घडामोडी, सेवा, ऑफर्स आणि बरंच काही — आता एकाच
              ठिकाणी.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#join">
                Early Access मिळवा <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-trust">
              <Users size={16} />{" "}
              <span>
                <strong>{registeredCount}</strong>{" "}
                {statsUnavailable
                  ? "नोंदणीचा live आकडा सध्या उपलब्ध नाही"
                  : "लोकांनी सुरुवात केली आहे"}
              </span>
            </div>
          </div>
        </section>

        <section className="instagram-section" id="instagram">
          <div className="section-wrap instagram-layout">
            <div className="instagram-copy">
              <span className="section-kicker">01 / FOLLOW THE MOVEMENT</span>
              <div className="instagram-heading">
                <div className="instagram-icon" aria-hidden="true">
                  <Instagram size={25} />
                </div>
                <div>
                  <h2>
                    अकोल्याची गोष्ट
                    <br />
                    <em>दररोज जवळून.</em>
                  </h2>
                  <p>
                    Local stories, business finds आणि Taaluka launch updates —
                    सगळ्यात आधी Instagram वर.
                  </p>
                </div>
              </div>
              <a
                className="instagram-follow"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
              >
                Instagram वर follow करा <ArrowRight size={17} />
              </a>
              <span className="instagram-note">
                Follow करून launch आधीच्या गोष्टी miss करू नका.
              </span>
            </div>
            <div className="instagram-preview" aria-label="Taaluka app preview">
              <img
                className="instagram-mockup-image"
                src="/manus-storage/pasted_file_WhSznl_LocalAppLaunchwithRedRibbon_047ee90e.png"
                alt="Taaluka mobile app wrapped in a red ribbon"
              />
            </div>
          </div>
        </section>

        <section className="join-strip" id="join">
          <div className="join-strip__intro">
            <span className="section-kicker">02 / BE FIRST IN LINE</span>
            <h2>
              अकोल्याच्या digital future मध्ये
              <br />
              <em>तुमची जागा</em> आजच ठेवा.
            </h2>
          </div>
          <div className="join-strip__form">
            <WaitlistForm
              onSubmit={register}
              isPending={registerMutation.isPending}
              error={friendlyRegistrationError(registerMutation.error?.message)}
              buttonLabel="Early Access मिळवा"
            />
            {referralCode && (
              <p className="referral-note">
                <Link2 size={14} /> तुम्हाला एक referral invite मिळालं आहे.
              </p>
            )}
          </div>
        </section>

        {status && (
          <section className="status-section">
            <div className="section-wrap">
              <ProgressPanel status={status} onShare={share} />
              <div className="share-row">
                <a
                  className="share-whatsapp"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={17} /> WhatsApp उघडा
                </a>
                <span>
                  {shareNotice ||
                    "मित्र आणि family ला सांगितलं की तुमची जागा आणखी पुढे जाईल."}
                </span>
              </div>
            </div>
          </section>
        )}

        <section className="benefits-section" id="why-taaluka">
          <div className="section-wrap">
            <div className="section-heading-row">
              <div>
                <span className="section-kicker">03 / WHY JOIN EARLY?</span>
                <h2>
                  अकोलेकरांसाठी.
                  <br />
                  <em>अकोलेकरांकडून.</em>
                </h2>
              </div>
              <p>
                Taaluka म्हणजे फक्त app नाही.
                <br />
                ही आपल्या तालुक्याची digital ओळख आहे.
              </p>
            </div>
            <div className="benefits-grid">
              {benefits.map(benefit => {
                const Icon = benefit.icon;
                return (
                  <article className="benefit-card" key={benefit.number}>
                    <div className="benefit-card__top">
                      <span>{benefit.number}</span>
                      <Icon size={21} />
                    </div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.copy}</p>
                    <div className="benefit-card__arrow">
                      <ArrowRight size={18} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="proof-section">
          <div className="section-wrap proof-layout">
            <div className="proof-copy">
              <span className="section-kicker section-kicker--light">
                04 / A LOCAL MOVEMENT
              </span>
              <h2>
                अकोलेकरांची पसंती,
                <br />
                <em>तालुक्याच्या डिजिटल</em>
                <br />
                भविष्याकडे!
              </h2>
            </div>
            <div className="proof-stat">
              <div className="proof-number">{registeredCount}</div>
              <span>registered for early access</span>
              <div className="proof-live">
                {!statsUnavailable && <span className="live-dot" />}{" "}
                {statsUnavailable
                  ? "live count unavailable"
                  : "live count · real registrations only"}
              </div>
            </div>
          </div>
        </section>

        <section className="closing-section">
          <div className="closing-orbit closing-orbit--one" />
          <div className="closing-orbit closing-orbit--two" />
          <div className="closing-inner" id="closing">
            <span className="section-kicker">05 / READY WHEN YOU ARE</span>
            <h2>
              अकोलेकर,
              <br />
              <em>तयार आहात ना?</em>
            </h2>
            <p>आपल्या तालुक्याच्या digital प्रवासाचा भाग व्हा.</p>
            <WaitlistForm
              onSubmit={register}
              isPending={registerMutation.isPending}
              error={friendlyRegistrationError(registerMutation.error?.message)}
              buttonLabel="माझी जागा निश्चित करा"
              compact
            />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <img src={LOGO_URL} alt="Taaluka" />
            <p>Our Taaluka. Our App. Our People.</p>
          </div>
          <div className="footer-links">
            <div>
              <span>Explore</span>
              <a href="#why-taaluka">का Taaluka?</a>
              <a href="#join">Early access</a>
            </div>
            <div>
              <span>Connect</span>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                <Instagram size={15} /> Instagram
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={15} /> WhatsApp
              </a>
            </div>
            <div>
              <span>Contact</span>
              <a href="mailto:hello@taaluka.app">hello@taaluka.app</a>
              <a href="#top">Akole, Maharashtra</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Taaluka. Made for Akole.</span>
          <div>
            <a href="#top">Privacy Policy</a>
            <a href="#top">Terms &amp; Conditions</a>
          </div>
        </div>
      </footer>
      <button
        className="scroll-cue"
        type="button"
        onClick={() =>
          document
            .getElementById("why-taaluka")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        aria-label="Scroll to discover"
      >
        <ChevronDown size={18} />
      </button>
    </div>
  );
}
