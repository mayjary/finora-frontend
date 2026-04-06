import React, { useState, useEffect, useRef } from "react";

const sections = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "ai-disclaimer", label: "AI Disclaimer" },
  { id: "not-financial-advice", label: "Not Financial Advice" },
  { id: "user-responsibilities", label: "User Responsibilities" },
  { id: "data-privacy", label: "Data & Privacy" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "limitations", label: "Limitations of Liability" },
  { id: "termination", label: "Termination" },
  { id: "changes", label: "Changes to Terms" },
  { id: "contact", label: "Contact" },
];

const AIWarningBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: "linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(239,68,68,0.06) 100%)",
      border: "1px solid rgba(251,191,36,0.35)",
      borderLeft: "3px solid #fbbf24",
      borderRadius: "2px",
      padding: "20px 24px",
      margin: "24px 0",
      position: "relative",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
      }}
    >
      <span style={{ fontSize: "16px" }}>⚠</span>
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.15em",
          color: "#fbbf24",
          textTransform: "uppercase",
          fontWeight: "600",
        }}
      >
        Important Notice
      </span>
    </div>
    <div style={{ color: "#e2c97e", lineHeight: "1.7", fontSize: "14px" }}>{children}</div>
  </div>
);

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: "22px",
      fontWeight: "700",
      color: "#f0ead6",
      marginBottom: "18px",
      marginTop: "0",
      letterSpacing: "-0.02em",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      paddingBottom: "12px",
    }}
  >
    {children}
  </h2>
);

const SubHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3
    style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: "11px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#94a3b8",
      marginBottom: "10px",
      marginTop: "28px",
    }}
  >
    {children}
  </h3>
);

const Para: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p
    style={{
      fontFamily: "'Lora', serif",
      fontSize: "14.5px",
      lineHeight: "1.8",
      color: "#b8bfd0",
      marginBottom: "16px",
      marginTop: "0",
    }}
  >
    {children}
  </p>
);

const Ul: React.FC<{ items: string[] }> = ({ items }) => (
  <ul style={{ margin: "0 0 20px 0", padding: "0 0 0 0", listStyle: "none" }}>
    {items.map((item, i) => (
      <li
        key={i}
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "10px",
          fontFamily: "'Lora', serif",
          fontSize: "14px",
          lineHeight: "1.7",
          color: "#b8bfd0",
        }}
      >
        <span style={{ color: "#3b82f6", marginTop: "2px", flexShrink: 0, fontSize: "12px" }}>◆</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const TermsAndConditions: React.FC = () => {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [scrolled, setScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const link1 = document.createElement("link");
    link1.rel = "preconnect";
    link1.href = "https://fonts.googleapis.com";
    document.head.appendChild(link1);

    const link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link2);

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0f1a",
        color: "#e2e8f0",
        fontFamily: "'Lora', serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0b0f1a; }
        ::-webkit-scrollbar-thumb { background: #1e2d4a; border-radius: 2px; }
        a { color: #60a5fa; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `}</style>

      {/* Ambient background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 15% 10%, rgba(30,58,138,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 85% 80%, rgba(124,58,237,0.08) 0%, transparent 55%)",
        }}
      />

      {/* Top bar */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(11,15,26,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "all 0.3s ease",
          padding: "0 40px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "13px" }}>◈</span>
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "18px",
              fontWeight: "700",
              color: "#f0ead6",
              letterSpacing: "-0.02em",
            }}
          >
            Finora
          </span>
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "#64748b",
            textTransform: "uppercase",
          }}
        >
          Terms &amp; Conditions
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px",
            color: "#475569",
            letterSpacing: "0.05em",
          }}
        >
          v1.0 · March 2026
        </div>
      </header>

      {/* Hero */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          paddingTop: "120px",
          paddingBottom: "64px",
          paddingLeft: "40px",
          paddingRight: "40px",
          maxWidth: "1100px",
          margin: "0 auto",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#3b82f6",
            marginBottom: "20px",
          }}
        >
          Legal Documentation
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: "700",
            color: "#f0ead6",
            margin: "0 0 20px 0",
            letterSpacing: "-0.03em",
            lineHeight: "1.15",
            maxWidth: "700px",
          }}
        >
          Terms &amp;
          <br />
          Conditions
        </h1>
        <p
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "16px",
            color: "#94a3b8",
            maxWidth: "580px",
            lineHeight: "1.7",
            margin: "0",
          }}
        >
          Please read these terms carefully before using the Finora platform. By accessing or using Finora, you agree
          to be bound by these terms in their entirety.
        </p>
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Effective Date", value: "01 March 2026" },
            { label: "Last Updated", value: "01 March 2026" },
            { label: "Jurisdiction", value: "India" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#475569",
                  marginBottom: "4px",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "12px",
                  color: "#94a3b8",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body layout */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 40px 120px",
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "64px",
          alignItems: "start",
        }}
      >
        {/* Sticky sidebar nav */}
        <nav
          style={{
            position: "sticky",
            top: "80px",
            paddingTop: "48px",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#475569",
              marginBottom: "16px",
            }}
          >
            Contents
          </div>
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                borderLeft: `2px solid ${activeSection === id ? "#3b82f6" : "rgba(255,255,255,0.07)"}`,
                padding: "7px 0 7px 14px",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontSize: "11px",
                color: activeSection === id ? "#93c5fd" : "#475569",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
                lineHeight: "1.4",
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main ref={contentRef} style={{ paddingTop: "48px" }}>
          {/* ── 1. Acceptance ── */}
          <section id="acceptance" style={{ marginBottom: "64px" }}>
            <SectionHeading>1. Acceptance of Terms</SectionHeading>
            <Para>
              By registering for, accessing, or using the Finora platform — including its web application, API, and all
              associated features — you ("User") agree to be legally bound by these Terms and Conditions ("Terms"). If
              you do not agree to any part of these Terms, you must not use the platform.
            </Para>
            <Para>
              These Terms constitute a legally binding agreement between you and the Finora development team ("we",
              "us", "our"). Your continued use of the platform following any modification to these Terms constitutes
              acceptance of those changes.
            </Para>
            <Para>
              You must be at least 18 years of age to use Finora. By using the platform, you represent and warrant that
              you meet this age requirement.
            </Para>
          </section>

          {/* ── 2. AI Disclaimer ── */}
          <section id="ai-disclaimer" style={{ marginBottom: "64px" }}>
            <SectionHeading>2. AI Disclaimer</SectionHeading>

            <AIWarningBox>
              Finora uses artificial intelligence to analyse trading chart images. AI-generated analysis is
              experimental, probabilistic, and inherently imperfect. You must not place undue trust in any output
              produced by the AI system, and you must not treat it as a definitive, reliable, or professional assessment
              of any financial instrument.
            </AIWarningBox>

            <SubHeading>2.1 Nature of AI Analysis</SubHeading>
            <Para>
              The AI analysis provided by Finora is generated by a large language model (Google Gemini) that interprets
              visual patterns in chart images. This technology, while capable, has significant limitations that every
              user must understand before relying on any output:
            </Para>
            <Ul
              items={[
                "AI analysis is based solely on the visual content of the uploaded chart image and does not incorporate real-time market data, news events, macroeconomic conditions, liquidity data, or any external information.",
                "The model may misidentify chart patterns, incorrectly assess trend direction, or produce inaccurate support and resistance levels, particularly on non-standard chart types or charts with overlaid indicators.",
                "Trade scores (0–100) are generated heuristically based on visual cues only and do not represent a statistically validated measure of trade quality.",
                "The same chart may produce different outputs across multiple submissions due to the non-deterministic nature of large language models.",
                "AI analysis quality is directly dependent on the resolution, clarity, and completeness of the uploaded chart image.",
              ]}
            />

            <SubHeading>2.2 Known Limitations</SubHeading>
            <Para>The following limitations have been identified during development and testing of the Finora AI system:</Para>
            <Ul
              items={[
                "Charts with non-standard or proprietary indicators (e.g. Volume Profile, VWAP, Anchored VWAP) may produce less reliable analysis as the model may not correctly interpret these overlays.",
                "Very high timeframe charts (Weekly, Monthly) may receive lower-quality analysis as the model is optimised for intraday and swing trading timeframes.",
                "The AI does not account for broker-specific spread, commission, or slippage in any risk-reward assessment it produces.",
                "The AI system does not have awareness of the current market session, time of day, or whether a market is open or closed.",
                "The AI cannot assess fundamental factors, earnings reports, regulatory changes, geopolitical events, or any factor not visible in the chart image.",
              ]}
            />

            <SubHeading>2.3 Your Obligation as a User</SubHeading>
            <Para>You acknowledge and agree that:</Para>
            <Ul
              items={[
                "You will independently verify all AI-generated analysis before making any trading or investment decision.",
                "You will not use AI analysis as the sole basis for entering, modifying, or exiting any trade or investment position.",
                "You understand that AI analysis represents one input among many that a responsible trader should consider.",
                "You will apply your own judgement, risk management rules, and trading knowledge when evaluating AI output.",
                "You accept full personal responsibility for any action taken in reliance on AI-generated analysis from Finora.",
              ]}
            />
          </section>

          {/* ── 3. Not Financial Advice ── */}
          <section id="not-financial-advice" style={{ marginBottom: "64px" }}>
            <SectionHeading>3. Not Financial Advice</SectionHeading>

            <AIWarningBox>
              Nothing on the Finora platform — including AI analysis, trade scores, market bias indicators,
              observations, suggestions, performance statistics, or any other content — constitutes financial advice,
              investment advice, trading advice, or any other form of professional financial guidance. Finora is a
              journaling and analytics tool, not a financial advisory service.
            </AIWarningBox>

            <Para>
              Finora is designed as a personal trade journaling and self-improvement tool. It helps traders organise,
              review, and reflect on their trading activity. It does not provide recommendations on whether to buy,
              sell, or hold any financial instrument, security, derivative, cryptocurrency, or any other asset.
            </Para>
            <Para>
              We are not registered financial advisors, investment managers, broker-dealers, or regulated financial
              service providers under any applicable law. We do not hold any financial services licence. No
              communication from Finora — whether generated by AI or otherwise — should be interpreted as regulated
              financial advice.
            </Para>
            <Para>
              Trading and investing in financial markets involves substantial risk of loss, including the possible loss
              of all invested capital. Past performance data stored in your Finora account is not indicative of future
              results. Market conditions change constantly, and historical trade analysis has no predictive value for
              future market behaviour.
            </Para>
            <Para>
              If you require financial advice, you should consult a qualified and licensed financial advisor, investment
              manager, or other regulated professional who can assess your individual financial circumstances, risk
              tolerance, and investment objectives.
            </Para>
          </section>

          {/* ── 4. User Responsibilities ── */}
          <section id="user-responsibilities" style={{ marginBottom: "64px" }}>
            <SectionHeading>4. User Responsibilities</SectionHeading>

            <SubHeading>4.1 Account Security</SubHeading>
            <Para>
              You are solely responsible for maintaining the confidentiality of your account credentials. You agree to
              notify us immediately of any unauthorised access to your account. We will not be liable for any loss or
              damage arising from your failure to maintain account security.
            </Para>

            <SubHeading>4.2 Acceptable Use</SubHeading>
            <Para>You agree not to:</Para>
            <Ul
              items={[
                "Use Finora for any unlawful purpose or in violation of any applicable local, national, or international law or regulation.",
                "Upload chart images containing content that is defamatory, obscene, fraudulent, or otherwise objectionable.",
                "Attempt to reverse-engineer, decompile, or otherwise extract the source code, AI prompts, or proprietary systems of Finora.",
                "Use automated scripts, bots, or other tools to access the platform in a manner that places unreasonable load on our systems.",
                "Impersonate any person or entity or misrepresent your affiliation with any person or entity.",
                "Share your account credentials with any third party.",
              ]}
            />

            <SubHeading>4.3 Accuracy of Information</SubHeading>
            <Para>
              You are responsible for the accuracy of all trade data you enter into Finora. We do not verify the
              accuracy of manually entered trades, CSV-imported trade data, or the quality of chart images you upload.
              Inaccurate input data will produce unreliable analytics and AI output.
            </Para>
          </section>

          {/* ── 5. Data & Privacy ── */}
          <section id="data-privacy" style={{ marginBottom: "64px" }}>
            <SectionHeading>5. Data &amp; Privacy</SectionHeading>

            <SubHeading>5.1 Data You Provide</SubHeading>
            <Para>
              By using Finora, you submit personal data including your email address, trade records, and chart images.
              This data is stored securely on Supabase infrastructure and is accessible only to you through your
              authenticated account. Row-level security policies ensure your data is isolated from other users.
            </Para>

            <SubHeading>5.2 Chart Images and AI Processing</SubHeading>
            <Para>
              Chart images you upload are transmitted to the Google Gemini API for analysis. By uploading a chart image,
              you consent to this transmission. You should not upload chart images containing sensitive personal
              information, confidential business data, or proprietary information that you do not wish to share with
              third-party AI services.
            </Para>
            <Para>
              Google's processing of your image data is governed by Google's Privacy Policy and Terms of Service. We
              encourage you to review Google's AI data usage policies at{" "}
              <a href="https://policies.google.com" target="_blank" rel="noopener noreferrer">
                policies.google.com
              </a>
              .
            </Para>

            <SubHeading>5.3 Data Retention</SubHeading>
            <Para>
              Your trade records, chart reviews, and account data are retained for as long as your account remains
              active. Upon account deletion, your data will be permanently removed from our systems within 30 days.
              Chart images stored in Supabase Storage are deleted immediately upon account deletion.
            </Para>

            <SubHeading>5.4 No Sale of Data</SubHeading>
            <Para>
              We do not sell, rent, or trade your personal data or trading records to any third party for commercial
              purposes. Your trading data is used solely to provide the Finora service to you.
            </Para>
          </section>

          {/* ── 6. Intellectual Property ── */}
          <section id="intellectual-property" style={{ marginBottom: "64px" }}>
            <SectionHeading>6. Intellectual Property</SectionHeading>
            <Para>
              All intellectual property rights in the Finora platform — including its software, AI prompt designs, user
              interface, branding, and documentation — are owned by or licensed to the Finora development team. You are
              granted a limited, non-exclusive, non-transferable licence to access and use the platform for your
              personal, non-commercial journaling purposes only.
            </Para>
            <Para>
              You retain full ownership of the trading data, chart images, and personal records you upload to Finora.
              By uploading content, you grant us a limited licence to process and store that content solely for the
              purpose of delivering the service to you.
            </Para>
            <Para>
              You may not copy, modify, distribute, sell, or create derivative works based on any part of the Finora
              platform without our prior written consent.
            </Para>
          </section>

          {/* ── 7. Limitations of Liability ── */}
          <section id="limitations" style={{ marginBottom: "64px" }}>
            <SectionHeading>7. Limitations of Liability</SectionHeading>

            <AIWarningBox>
              Finora and its developers shall not be held liable for any trading losses, investment losses, missed
              opportunities, or financial damages of any kind arising from your use of the platform, including but not
              limited to losses resulting from reliance on AI-generated chart analysis, trade scores, market bias
              indicators, or performance statistics.
            </AIWarningBox>

            <Para>
              To the fullest extent permitted by applicable law, Finora and its developers, affiliates, and
              contributors shall not be liable for any indirect, incidental, special, consequential, or punitive
              damages arising out of or in connection with your use of the platform, even if we have been advised of the
              possibility of such damages.
            </Para>
            <Para>
              The platform is provided on an "as is" and "as available" basis without warranties of any kind, either
              express or implied, including but not limited to warranties of merchantability, fitness for a particular
              purpose, and non-infringement. We do not warrant that the platform will be uninterrupted, error-free, or
              that defects will be corrected.
            </Para>
            <Para>
              We do not warrant the accuracy, completeness, or reliability of any AI-generated analysis, market data,
              or statistical output provided by the platform. All such output is provided for informational and
              self-improvement purposes only.
            </Para>
            <Para>
              In jurisdictions that do not permit the exclusion or limitation of incidental or consequential damages,
              our liability is limited to the maximum extent permitted by law.
            </Para>
          </section>

          {/* ── 8. Termination ── */}
          <section id="termination" style={{ marginBottom: "64px" }}>
            <SectionHeading>8. Termination</SectionHeading>
            <Para>
              We reserve the right to suspend or terminate your access to Finora at any time, with or without notice,
              for any conduct that we believe violates these Terms or is otherwise harmful to the platform, other users,
              or third parties.
            </Para>
            <Para>
              You may terminate your account at any time by using the account deletion option in the Settings page. Upon
              termination, your right to use the platform ceases immediately. Sections of these Terms that by their
              nature should survive termination — including intellectual property provisions, disclaimers, and
              limitations of liability — shall survive.
            </Para>
          </section>

          {/* ── 9. Changes ── */}
          <section id="changes" style={{ marginBottom: "64px" }}>
            <SectionHeading>9. Changes to Terms</SectionHeading>
            <Para>
              We may update these Terms at any time to reflect changes in the platform, applicable law, or our
              operational practices. When we make material changes, we will update the "Last Updated" date at the top of
              this page and, where appropriate, notify you by email or via an in-app notification.
            </Para>
            <Para>
              Your continued use of Finora after the effective date of any revised Terms constitutes your acceptance of
              those revised Terms. If you do not agree to the revised Terms, you must discontinue your use of the
              platform.
            </Para>
          </section>

          {/* ── 10. Contact ── */}
          <section id="contact" style={{ marginBottom: "64px" }}>
            <SectionHeading>10. Contact</SectionHeading>
            <Para>
              If you have any questions, concerns, or requests regarding these Terms and Conditions, the AI disclaimer,
              or your data, please contact the Finora development team at:
            </Para>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "4px",
                padding: "20px 24px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "13px",
                color: "#94a3b8",
                lineHeight: "1.9",
              }}
            >
              <div>
                <span style={{ color: "#475569" }}>project://</span> Finora — AI Powered Trade Analytics Platform
              </div>
              <div>
                <span style={{ color: "#475569" }}>built by// </span> Final Year B.E. Computer Science Team
              </div>
              <div>
                <span style={{ color: "#475569" }}>guide:// </span> Prof. Samina Siddiqui
              </div>
            </div>
          </section>

          {/* Agreement footer */}
          <div
            style={{
              marginTop: "48px",
              padding: "32px",
              background: "rgba(59,130,246,0.04)",
              border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "18px",
                color: "#f0ead6",
                marginBottom: "12px",
              }}
            >
              Acknowledgement
            </div>
            <Para>
              By using Finora you confirm that you have read, understood, and agree to these Terms and Conditions in
              full, including the AI Disclaimer and the statement that Finora does not provide financial advice.
            </Para>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              <div
                onClick={() => setAgreed(!agreed)}
                style={{
                  width: "20px",
                  height: "20px",
                  flexShrink: 0,
                  background: agreed ? "#3b82f6" : "transparent",
                  border: `2px solid ${agreed ? "#3b82f6" : "rgba(255,255,255,0.2)"}`,
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  marginTop: "1px",
                  cursor: "pointer",
                }}
              >
                {agreed && <span style={{ color: "white", fontSize: "12px", lineHeight: 1 }}>✓</span>}
              </div>
              <span
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: "14px",
                  color: "#94a3b8",
                  lineHeight: "1.6",
                  userSelect: "none",
                }}
              >
                I have read and understood the Terms and Conditions, including the AI Disclaimer. I understand that
                Finora does not provide financial advice and that I am solely responsible for all trading decisions I
                make.
              </span>
            </label>

            <button
              disabled={!agreed}
              style={{
                marginTop: "24px",
                padding: "12px 32px",
                background: agreed
                  ? "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)"
                  : "rgba(255,255,255,0.05)",
                border: `1px solid ${agreed ? "transparent" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "3px",
                color: agreed ? "#ffffff" : "#475569",
                fontFamily: "'DM Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: agreed ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
            >
              {agreed ? "I Accept These Terms →" : "Please confirm above to continue"}
            </button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "11px",
            color: "#334155",
          }}
        >
          © 2026 Finora · All rights reserved
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px",
            color: "#1e293b",
            letterSpacing: "0.1em",
          }}
        >
          FINORA IS NOT A REGISTERED FINANCIAL SERVICE PROVIDER
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;

