// src/components/PlatformAnalytics.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Smartlink } from '@/types/smartlink';
import { BarChart3, TrendingUp, Award, Activity } from 'lucide-react';

interface PlatformAnalyticsProps {
  smartlinks: Smartlink[];
}

interface PlatformStats {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalClicks: number;
  percentage: number;
  smartlinkCount: number;
}

export const PlatformAnalytics: React.FC<PlatformAnalyticsProps> = ({ smartlinks }) => {
  const platformStats = useMemo(() => {
    const stats = new Map<string, PlatformStats>();
    let totalClicks = 0;

    // Collect all clicks for each platform across all smartlinks
    smartlinks.forEach(smartlink => {
      smartlink.platforms.forEach(platform => {
        const clicks = smartlink.clicks[platform.id] || 0;
        totalClicks += clicks;

        if (stats.has(platform.id)) {
          const existing = stats.get(platform.id)!;
          stats.set(platform.id, {
            ...existing,
            totalClicks: existing.totalClicks + clicks,
            smartlinkCount: existing.smartlinkCount + (clicks > 0 ? 1 : 0)
          });
        } else {
          stats.set(platform.id, {
            id: platform.id,
            name: platform.name,
            icon: platform.icon,
            color: platform.color,
            totalClicks: clicks,
            percentage: 0,
            smartlinkCount: clicks > 0 ? 1 : 0
          });
        }
      });
    });

    // Calculate percentages
    const platformArray = Array.from(stats.values()).map(stat => ({
      ...stat,
      percentage: totalClicks > 0 ? (stat.totalClicks / totalClicks) * 100 : 0
    }));

    // Sort by total clicks (descending)
    return platformArray.sort((a, b) => b.totalClicks - a.totalClicks);
  }, [smartlinks]);

  const totalClicks = platformStats.reduce((sum, platform) => sum + platform.totalClicks, 0);
  const topPlatform = platformStats[0];
  const activePlatforms = platformStats.filter(p => p.totalClicks > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Analytics des Plateformes</h2>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plateforme Leader</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            {topPlatform ? (
              <div className="flex items-center gap-2">
                <span className="text-lg">{topPlatform.icon}</span>
                <div>
                  <div className="text-xl font-bold">{topPlatform.name}</div>
                  <p className="text-xs text-muted-foreground">
                    {topPlatform.totalClicks} clics ({topPlatform.percentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Aucune donnée</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plateformes Actives</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePlatforms}</div>
            <p className="text-xs text-muted-foreground">
              sur {platformStats.length} configurées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {smartlinks.length > 0 ? ((totalClicks / smartlinks.reduce((sum, s) => sum + s.views, 0)) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Clics / Vues totales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Répartition des Clics par Plateforme
          </CardTitle>
        </CardHeader>
        <CardContent>
          {platformStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune donnée d'analytics disponible
            </div>
          ) : (
            <div className="space-y-4">
              {platformStats.map((platform, index) => (
                <div key={platform.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {index < 3 && (
                          <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"} className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                        )}
                        <span className="text-lg">{platform.icon}</span>
                        <span className="font-medium">{platform.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{platform.totalClicks} clics</div>
                      <div className="text-sm text-muted-foreground">
                        {platform.percentage.toFixed(1)}% • {platform.smartlinkCount} smartlinks
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Progress 
                      value={platform.percentage} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Performance relative</span>
                      <span>{platform.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      {platformStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Insights & Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPlatform && topPlatform.totalClicks > 0 && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-blue-900">
                      🏆 {topPlatform.name} domine avec {topPlatform.percentage.toFixed(1)}% des clics
                    </p>
                    <p className="text-sm text-blue-700">
                      Cette plateforme génère le plus d'engagement. Considérez la mettre en avant dans vos smartlinks.
                    </p>
                  </div>
                </div>
              )}
              
              {platformStats.filter(p => p.totalClicks === 0).length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-orange-900">
                      ⚠️ {platformStats.filter(p => p.totalClicks === 0).length} plateformes sans clics
                    </p>
                    <p className="text-sm text-orange-700">
                      Vérifiez que les liens sont corrects ou considérez retirer les plateformes peu populaires.
                    </p>
                  </div>
                </div>
              )}
              
              {activePlatforms >= 3 && totalClicks > 50 && (
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-green-900">
                      ✅ Excellente diversification
                    </p>
                    <p className="text-sm text-green-700">
                      Vous avez une bonne répartition sur {activePlatforms} plateformes actives avec {totalClicks} clics totaux.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};