import { useEffect, useMemo, useState, type FormEvent } from "react";
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

const LOGO_URL = "/assets/taaluka-logo.png";
const INSTAGRAM_URL =
  "https://www.instagram.com/taaluka.akole?utm_source=ig_web_button_share_sheet&srtk=ZDNlZDc0MzIxNw==";
const WHATSAPP_MESSAGE =
  "अकोल्यासाठी काहीतरी खास येतंय — Taaluka च्या early access मध्ये माझ्यासोबत या!";
const IS_NETLIFY_STATIC = import.meta.env.VITE_NETLIFY_STATIC === "true";

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
  if (!IS_NETLIFY_STATIC || typeof window === "undefined") return true;

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

async function fetchNetlifyCount() {
  if (!IS_NETLIFY_STATIC || typeof window === "undefined") return null;

  try {
    const response = await fetch("/api/waitlist-count", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      available?: boolean;
      totalCount?: number;
    };
    return data.available &&
      typeof data.totalCount === "number" &&
      Number.isSafeInteger(data.totalCount)
      ? data.totalCount
      : null;
  } catch {
    return null;
  }
}

const benefits = [
  {
    number: "01",
    icon: MapPin,
    title: "अकोल्यातील प्रत्येक गोष्ट, एकाच ठिकाणी.",
    copy: "स्थानिक व्यवसाय, सेवा आणि गरजा पूर्ण करणाऱ्या सुविधा — आता शोधा सहज, एकाच ॲपवर.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "स्थानिकांची साथ, स्थानिकांची प्रगती.",
    copy: "व्यवसायांना ग्राहकांशी, नोकरी शोधणाऱ्यांना संधींशी आणि नागरिकांना आपल्या परिसराशी जोडणारे एक व्यासपीठ.",
  },
  {
    number: "03",
    icon: Zap,
    title: "अकोले तालुक्याची डिजिटल ओळख.",
    copy: "स्थानिक घडामोडी, कम्युनिटी अपडेट्स आणि संधींना एकत्र आणून अकोल्याच्या डिजिटल प्रगतीचा भाग व्हा.",
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
  const [netlifyCount, setNetlifyCount] = useState<number | null>(null);
  const [shareNotice, setShareNotice] = useState("");
  const [staticSubmitting, setStaticSubmitting] = useState(false);
  const [staticSubmitted, setStaticSubmitted] = useState(false);
  const [staticError, setStaticError] = useState("");
  const referralCode = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return new URLSearchParams(window.location.search).get("ref") || undefined;
  }, []);
  const stats = trpc.waitlist.stats.useQuery(undefined, {
    enabled: !IS_NETLIFY_STATIC,
    refetchInterval: 30_000,
  });

  useEffect(() => {
    if (!IS_NETLIFY_STATIC) return;

    let cancelled = false;
    const refreshCount = async () => {
      const count = await fetchNetlifyCount();
      if (!cancelled && count !== null) setNetlifyCount(count);
    };

    refreshCount();
    const interval = window.setInterval(refreshCount, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

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

  const register = async (name: string, mobile: string) => {
    setShareNotice("");
    if (IS_NETLIFY_STATIC) {
      setStaticSubmitting(true);
      setStaticError("");
      const netlifySaved = await submitToNetlify(name, mobile);
      setStaticSubmitting(false);
      if (!netlifySaved) {
        setStaticError(
          "नोंदणी सध्या पूर्ण झाली नाही. कृपया पुन्हा प्रयत्न करा."
        );
        return;
      }
      setStaticSubmitted(true);
      const count = await fetchNetlifyCount();
      if (count !== null) setNetlifyCount(count);
      toast.success("अभिनंदन! तुमची नोंदणी Taaluka कडे पाठवली आहे.");
      document
        .getElementById("join")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

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

  const statsUnavailable = IS_NETLIFY_STATIC
    ? netlifyCount === null
    : stats.isError || stats.data?.available === false;
  const registeredCount = IS_NETLIFY_STATIC
    ? (netlifyCount?.toLocaleString("en-IN") ?? "—")
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
            Join Taaluka Lunch <ArrowRight size={15} />
          </a>
        </nav>
        <a
          className="mobile-nav-cta"
          href="#join"
          aria-label="Join Taaluka Lunch"
        >
          Join Taaluka Lunch
        </a>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" /> AKOLE • MAHARASHTRA
            </div>
            <div className="hero-brand-word">&quot; तालुका &quot;</div>
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
            <div className="hero-actions hero-actions--hero">
              <a
                className="button button--primary hero-early-access"
                href="#join"
              >
                Join Taaluka Lunch <ArrowRight size={17} />
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
              <img
                className="instagram-mobile-logo"
                src={LOGO_URL}
                alt="Taaluka"
              />
              <div className="instagram-heading">
                <div>
                  <h2>
                    आपल्या तालुक्याचे
                    <br />
                    <em>आपले ॲप</em>
                  </h2>
                  <p>
                    अकोल्यातील स्थानिक सेवा, व्यवसाय, नोकऱ्या, व्यवहार, ऑफर्स,
                    कम्युनिटी आणि घडामोडी ...सर्व काही एकाच ॲपवर, आपल्या हातावर!
                  </p>
                </div>
              </div>
              <div className="instagram-cta-stack">
                <a className="instagram-launch" href="#join">
                  Join Taaluka Launch <ArrowRight size={17} />
                </a>
                <a
                  className="instagram-follow"
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Tap to Follow on Instagram <ArrowRight size={17} />
                </a>
                <span className="instagram-handle">
                  <Instagram size={14} /> taaluka.akole
                </span>
                <span className="instagram-note">
                  Taaluka कम्युनिटीमध्ये Join व्हा, Register करा आणि Follow करा.
                </span>
              </div>
            </div>
            <div className="instagram-preview" aria-label="Taaluka app preview">
              <img
                className="instagram-mockup-image"
                src="/assets/taaluka-app-ribbon.png"
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
              isPending={
                IS_NETLIFY_STATIC
                  ? staticSubmitting
                  : registerMutation.isPending
              }
              error={
                IS_NETLIFY_STATIC
                  ? staticError
                  : friendlyRegistrationError(registerMutation.error?.message)
              }
              buttonLabel="Join Taaluka Lunch"
            />
            {staticSubmitted && (
              <p className="netlify-success" role="status">
                तुमची नोंदणी Netlify Forms मध्ये सुरक्षितरीत्या पाठवली आहे.
              </p>
            )}
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
                <span className="section-kicker">
                  03 / VISION OF TAALUKA APP
                </span>
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
              <a href="/about">About us</a>
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
              <a href="/contact">Contact us</a>
              <a href="mailto:taaluka.app@gmail.com">taaluka.app@gmail.com</a>
              <a href="#top">Akole, Maharashtra</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Taaluka. Made for Akole.</span>
          <div>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-and-conditions">Terms &amp; Conditions</a>
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
