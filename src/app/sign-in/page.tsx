import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100dvh",
      width: "100vw",
      background: "#080d2e",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 20px",
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Top glow */}
      <div style={{
        position: "absolute",
        top: "-80px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "500px",
        height: "400px",
        background: "radial-gradient(ellipse at 50% 20%, rgba(44,93,169,0.5) 0%, rgba(44,93,169,0.1) 50%, transparent 75%)",
        pointerEvents: "none",
      }} />

      {/* Bottom glow */}
      <div style={{
        position: "absolute",
        bottom: "-100px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "400px",
        height: "300px",
        background: "radial-gradient(ellipse at 50% 80%, rgba(200,218,249,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Grid */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.04,
        backgroundImage:
          "linear-gradient(rgba(200,218,249,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,218,249,1) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Branding */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "32px",
        gap: "12px",
      }}>
        {/* Logo mark */}
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "18px",
          background: "linear-gradient(145deg, #1e3a8a, #2c5da9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 0 1px rgba(200,218,249,0.15), 0 12px 32px rgba(44,93,169,0.5)",
        }}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <path d="M10 8h7c4.42 0 8 3.58 8 8s-3.58 8-8 8h-7V8z" fill="rgba(200,218,249,0.18)" />
            <path d="M14 12c2.76 0 5 1.79 5 4s-2.24 4-5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <circle cx="11" cy="16" r="1.6" fill="white" />
          </svg>
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "38px",
            color: "#ffffff",
            letterSpacing: "0.1em",
            margin: 0,
            fontWeight: 400,
            lineHeight: 1,
          }}>
            DRIFT
          </h1>
          <p style={{
            fontSize: "14px",
            color: "rgba(200,218,249,0.6)",
            marginTop: "8px",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.01em",
          }}>
            Sign in to sync your browser across devices
          </p>
        </div>
      </div>

      {/* Clerk card */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "420px" }}>
        <SignIn
          routing="hash"
          appearance={{
            variables: {
              colorPrimary: "#3b7dd8",
              colorBackground: "#0f1a5c",
              colorText: "#ffffff",
              colorTextSecondary: "rgba(200,218,249,0.75)",
              colorInputBackground: "#162266",
              colorInputText: "#ffffff",
              colorNeutral: "rgba(200,218,249,0.5)",
              borderRadius: "14px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
            },
            elements: {
              card: {
                background: "rgba(15,26,92,0.9)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(200,218,249,0.15)",
                boxShadow: "0 0 0 1px rgba(44,93,169,0.2), 0 32px 80px rgba(8,13,46,0.8)",
                borderRadius: "24px",
                padding: "32px 28px",
              },
              headerTitle: {
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: "600",
                fontFamily: "'DM Sans', sans-serif",
              },
              headerSubtitle: {
                color: "rgba(200,218,249,0.65)",
                fontSize: "13px",
              },
              socialButtonsBlockButton: {
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(200,218,249,0.2)",
                color: "#ffffff",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
              },
              socialButtonsBlockButtonText: {
                color: "#ffffff",
                fontWeight: "500",
              },
              dividerLine: {
                background: "rgba(200,218,249,0.12)",
              },
              dividerText: {
                color: "rgba(200,218,249,0.45)",
                fontSize: "12px",
              },
              formFieldLabel: {
                color: "rgba(200,218,249,0.8)",
                fontSize: "13px",
                fontWeight: "500",
              },
              formFieldInput: {
                background: "rgba(22,34,102,0.8)",
                border: "1px solid rgba(200,218,249,0.18)",
                color: "#ffffff",
                borderRadius: "12px",
                fontSize: "14px",
                padding: "12px 14px",
              },
              formButtonPrimary: {
                background: "linear-gradient(135deg, #2c5da9 0%, #1a3f7a 100%)",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                boxShadow: "0 4px 20px rgba(44,93,169,0.5)",
                color: "#ffffff",
              },
              footerActionText: {
                color: "rgba(200,218,249,0.6)",
                fontSize: "13px",
              },
              footerActionLink: {
                color: "#93c5fd",
                fontWeight: "600",
                fontSize: "13px",
              },
              identityPreviewText: {
                color: "rgba(200,218,249,0.8)",
              },
              identityPreviewEditButton: {
                color: "#93c5fd",
              },
              formFieldInputShowPasswordButton: {
                color: "rgba(200,218,249,0.5)",
              },
              otpCodeFieldInput: {
                background: "rgba(22,34,102,0.8)",
                border: "1px solid rgba(200,218,249,0.18)",
                color: "#ffffff",
                borderRadius: "10px",
              },
              alertText: {
                color: "#fca5a5",
              },
              formFieldErrorText: {
                color: "#fca5a5",
              },
            },
          }}
        />
      </div>

      {/* Footer */}
      <p style={{
        position: "relative",
        zIndex: 10,
        marginTop: "28px",
        fontSize: "11px",
        color: "rgba(200,218,249,0.2)",
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.02em",
      }}>
        DRIFT built by Aisha Aliyu
      </p>
    </div>
  );
}
