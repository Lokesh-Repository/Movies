import { type ReactNode } from "react";
import { useBreakpoint } from "../../hooks/useResponsive";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isMobile, isSmallMobile, containerPadding, fontSize } = useBreakpoint();
  
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: `0 ${containerPadding}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: isMobile ? "64px" : "80px",
            }}
          >
            <div style={{ 
              display: "flex", 
              alignItems: "center",
              flex: "1",
              minWidth: "0" // Allow text to truncate
            }}>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: isSmallMobile ? "6px" : "8px",
                  marginRight: isSmallMobile ? "8px" : "16px",
                  flexShrink: "0"
                }}
              >
                <svg
                  style={{ 
                    width: isSmallMobile ? "24px" : "32px", 
                    height: isSmallMobile ? "24px" : "32px", 
                    color: "white" 
                  }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                </svg>
              </div>
              <h1
                style={{
                  fontSize: fontSize['3xl'],
                  fontWeight: "bold",
                  color: "white",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: isSmallMobile ? "nowrap" : "normal",
                  lineHeight: isMobile ? "1.2" : "1"
                }}
              >
                {isSmallMobile ? "🎬 Movies & TV" : "🎬 Movies & TV Shows Manager"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "16px" : `32px ${containerPadding}`,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: isMobile ? "12px" : "16px",
            boxShadow: "0 20px 25px rgba(0, 0, 0, 0.1)",
            padding: containerPadding,
            border: "1px solid #E5E7EB",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
