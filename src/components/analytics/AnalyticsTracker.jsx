import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    base44.analytics.track({
      eventName: "page_view",
      properties: {
        page_path: location.pathname,
        page_title: document.title,
      }
    });
  }, [location]);

  return null;
}