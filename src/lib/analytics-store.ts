// Simple in-memory analytics store
// Note: Data resets on deployment/restart but is completely free

interface PageView {
  path: string;
  timestamp: number;
  userAgent?: string;
  ip?: string;
  referer?: string;
}

interface AnalyticsData {
  pageViews: PageView[];
  uniqueIPs: Set<string>;
  totalVisits: number;
  startTime: number;
}

// In-memory store
const analyticsStore: AnalyticsData = {
  pageViews: [],
  uniqueIPs: new Set(),
  totalVisits: 0,
  startTime: Date.now(),
};

export function trackPageView(data: Omit<PageView, 'timestamp'>) {
  const pageView: PageView = {
    ...data,
    timestamp: Date.now(),
  };

  analyticsStore.pageViews.push(pageView);
  analyticsStore.totalVisits++;
  
  if (data.ip) {
    analyticsStore.uniqueIPs.add(data.ip);
  }

  // Keep only last 10000 views to prevent memory issues
  if (analyticsStore.pageViews.length > 10000) {
    analyticsStore.pageViews = analyticsStore.pageViews.slice(-10000);
  }
}

export function getAnalytics() {
  const now = Date.now();
  const last24h = now - 24 * 60 * 60 * 1000;
  const last7d = now - 7 * 24 * 60 * 60 * 1000;

  const recentViews = analyticsStore.pageViews.filter(
    (view) => view.timestamp > last24h
  );

  const weekViews = analyticsStore.pageViews.filter(
    (view) => view.timestamp > last7d
  );

  // Top pages
  const pageCounts = new Map<string, number>();
  analyticsStore.pageViews.forEach((view) => {
    pageCounts.set(view.path, (pageCounts.get(view.path) || 0) + 1);
  });

  const topPages = Array.from(pageCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  // Unique IPs in last 24h
  const uniqueIPs24h = new Set(
    recentViews.map((view) => view.ip).filter(Boolean)
  );

  return {
    totalVisits: analyticsStore.totalVisits,
    uniqueVisitors: analyticsStore.uniqueIPs.size,
    last24hVisits: recentViews.length,
    last7dVisits: weekViews.length,
    uniqueVisitors24h: uniqueIPs24h.size,
    topPages,
    recentPageViews: analyticsStore.pageViews.slice(-100).reverse(),
    uptimeSince: new Date(analyticsStore.startTime).toISOString(),
  };
}
