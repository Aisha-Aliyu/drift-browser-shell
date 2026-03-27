import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: "100dvh",
      width: "100vw",
      background: "linear-gradient(160deg, #0a0f3c 0%, #0d1347 50%, #111a54 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 20px",
      boxSizing: "border-box",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "300px",
        background: "radial-gradient(ellipse at 50% 0%, rgba(44,93,169,0.35) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(200,218,249,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,218,249,1) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginBottom: "28px" }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #1a2868, #2c5da9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 12px",
          boxShadow: "0 8px 24px rgba(44,93,169,0.4)",
        }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M10 8h7c4.42 0 8 3.58 8 8s-3.58 8-8 8h-7V8z" fill="rgba(200,218,249,0.15)" />
            <path d="M14 12c2.76 0 5 1.79 5 4s-2.24 4-5 4" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="11" cy="16" r="1.5" fill="white" opacity="0.8" />
          </svg>
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "32px",
          color: "#f4f8ff",
          letterSpacing: "0.08em",
          margin: 0,
          fontWeight: 400,
        }}>
          DRIFT
        </h1>
        <p style={{
          fontSize: "14px",
          color: "rgba(200,218,249,0.45)",
          marginTop: "6px",
        }}>
          Create an account to sync your browser
        </p>
      </div>

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "400px" }}>
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#2c5da9",
              colorBackground: "#0d1347",
              colorText: "#f4f8ff",
              colorTextSecondary: "rgba(200,218,249,0.55)",
              colorInputBackground: "#1a2868",
              colorInputText: "#f4f8ff",
              colorNeutral: "rgba(200,218,249,0.3)",
              borderRadius: "12px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
            },
            elements: {
              card: {
                background: "rgba(17,26,84,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(200,218,249,0.1)",
                boxShadow: "0 24px 64px rgba(10,15,60,0.7)",
                borderRadius: "20px",
                padding: "28px",
              },
              headerTitle: {
                color: "#f4f8ff",
                fontSize: "18px",
                fontFamily: "'DM Serif Display', serif",
              },
              headerSubtitle: {
                color: "rgba(200,218,249,0.5)",
              },
              socialButtonsBlockButton: {
                background: "rgba(26,40,104,0.8)",
                border: "1px solid rgba(200,218,249,0.12)",
                color: "#f4f8ff",
                borderRadius: "10px",
              },
              dividerLine: {
                background: "rgba(200,218,249,0.08)",
              },
              dividerText: {
                color: "rgba(200,218,249,0.3)",
              },
              formFieldLabel: {
                color: "rgba(200,218,249,0.55)",
                fontSize: "12px",
              },
              formFieldInput: {
                background: "rgba(26,40,104,0.7)",
                border: "1px solid rgba(200,218,249,0.12)",
                color: "#f4f8ff",
                borderRadius: "10px",
                fontSize: "14px",
              },
              formButtonPrimary: {
                background: "linear-gradient(135deg, #2c5da9, #1a3f7a)",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow: "0 4px 16px rgba(44,93,169,0.4)",
              },
              footerActionLink: {
                color: "#c8daf9",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
