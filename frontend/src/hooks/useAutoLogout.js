import { useEffect } from "react";

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export default function useAutoLogout(logout) {
  useEffect(() => {
    let idleTimer;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(logout, IDLE_TIMEOUT);
    };

    // Listen for user activity
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach(evt => window.addEventListener(evt, resetIdleTimer));

    // Start timer on mount
    resetIdleTimer();

    // Optional: logout when tab is closed or refreshed
    const handleUnload = () => logout();
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearTimeout(idleTimer);
      events.forEach(evt => window.removeEventListener(evt, resetIdleTimer));
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [logout]);
}