'use client';

import { useState, useEffect } from 'react';
import { Lock, TrendingUp, Users, Eye, Globe, Clock, BarChart3, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  last24hVisits: number;
  last7dVisits: number;
  uniqueVisitors24h: number;
  topPages: Array<{ path: string; count: number }>;
  recentPageViews: Array<{
    path: string;
    timestamp: number;
    ip?: string;
    userAgent?: string;
    referer?: string;
  }>;
  uptimeSince: string;
}

export default function AnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = () => {
    if (code.length !== 6) {
      setError('Code must be 6 digits');
      return;
    }

    // Store the code and mark as authenticated
    sessionStorage.setItem('analytics_token', code);
    setIsAuthenticated(true);
    setError('');
    fetchAnalytics(code);
  };

  const fetchAnalytics = async (token?: string) => {
    setLoading(true);
    try {
      const authToken = token || sessionStorage.getItem('analytics_token');
      const response = await fetch('/api/analytics/data', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
        setError('');
      } else {
        setError('Invalid authentication code');
        setIsAuthenticated(false);
        sessionStorage.removeItem('analytics_token');
      }
    } catch (err) {
      setError('Failed to fetch analytics');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('analytics_token');
    if (token) {
      setIsAuthenticated(true);
      fetchAnalytics(token);
    }
  }, []);

  const handleRefresh = () => {
    fetchAnalytics();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit access code to continue
              </p>
            </div>
            <div className="w-full space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                className="text-center text-2xl tracking-widest"
              />
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <Button onClick={handleAuth} className="w-full h-12">
                Unlock Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Robotics Documentation - Web Analytics
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {analytics && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Visits</p>
                    <p className="text-3xl font-bold mt-1">
                      {analytics.totalVisits.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Unique Visitors</p>
                    <p className="text-3xl font-bold mt-1">
                      {analytics.uniqueVisitors.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last 24h</p>
                    <p className="text-3xl font-bold mt-1">
                      {analytics.last24hVisits.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analytics.uniqueVisitors24h} unique
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last 7 Days</p>
                    <p className="text-3xl font-bold mt-1">
                      {analytics.last7dVisits.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Top Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Top Pages
                </h2>
                <div className="space-y-3">
                  {analytics.topPages.map((page, index) => (
                    <div
                      key={page.path}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <span className="text-sm truncate">{page.path}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {page.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  System Info
                </h2>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Tracking Since</p>
                    <p className="text-sm font-medium mt-1">
                      {new Date(analytics.uptimeSince).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Data Retention</p>
                    <p className="text-sm font-medium mt-1">
                      In-memory (resets on deployment)
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Storage Type</p>
                    <p className="text-sm font-medium mt-1">
                      Free - No external dependencies
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-4 p-3 text-sm font-medium text-muted-foreground border-b">
                  <div>Time</div>
                  <div>Page</div>
                  <div>IP</div>
                  <div>User Agent</div>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-1">
                  {analytics.recentPageViews.slice(0, 50).map((view, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 p-3 text-sm rounded-lg hover:bg-muted/50"
                    >
                      <div className="text-muted-foreground">
                        {new Date(view.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="truncate">{view.path}</div>
                      <div className="text-muted-foreground truncate">
                        {view.ip || 'N/A'}
                      </div>
                      <div className="text-muted-foreground truncate text-xs">
                        {view.userAgent?.substring(0, 50) || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
