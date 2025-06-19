// src/pages/SmartlinkPage.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import { initializeGTM, initializeGA4, trackEvent } from '@/lib/analytics';
import { Smartlink } from '@/types/smartlink';
import { ExternalLink, Calendar, Music, Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { PlatformIcon } from '@/components/PlatformIcons';

export default function SmartlinkPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [smartlink, setSmartlink] = useState<Smartlink | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const link = storage.getSmartlinkById(id);
      if (link) {
        setSmartlink(link);
        
        // Initialize analytics
        if (link.analytics.gtmId) {
          initializeGTM(link.analytics.gtmId);
        }
        if (link.analytics.ga4Id) {
          initializeGA4(link.analytics.ga4Id);
        }
        
        // Track page view
        storage.incrementViews(id);
        trackEvent('smartlink_view', {
          smartlink_id: id,
          smartlink_title: link.title,
          artist: link.artist
        });
      }
      setIsLoading(false);
    }
  }, [id]);

  const handlePlatformClick = (platformId: string, url: string, platformName: string) => {
    if (id && url) {
      storage.incrementClicks(id, platformId);
      trackEvent('platform_click', {
        smartlink_id: id,
        platform_id: platformId,
        platform_name: platformName,
        smartlink_title: smartlink?.title,
        artist: smartlink?.artist
      });
      window.open(url, '_blank');
    }
  };

  const shareSmartlink = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: smartlink?.title,
          text: `Écoutez "${smartlink?.title}" de ${smartlink?.artist}`,
          url: url,
        });
        trackEvent('smartlink_share', {
          smartlink_id: id,
          method: 'native_share'
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Lien copié !",
          description: "Le lien du smartlink a été copié dans le presse-papiers.",
        });
        trackEvent('smartlink_share', {
          smartlink_id: id,
          method: 'copy_link'
        });
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du smartlink...</p>
        </div>
      </div>
    );
  }

  if (!smartlink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-16">
            <div className="mb-4">
              <Music className="h-16 w-16 text-slate-400 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Smartlink introuvable
            </h2>
            <p className="text-slate-600">
              Ce smartlink n'existe pas ou a été supprimé.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const customStyles = {
    backgroundColor: smartlink.customization.backgroundColor,
    color: smartlink.customization.textColor,
  };

  return (
    <div 
      className="min-h-screen p-6 relative overflow-hidden"
      style={customStyles}
    >
      {/* Background image with blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/background-sample.png)',
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
          zIndex: -2
        }}
      />
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/30"
        style={{ zIndex: -1 }}
      />
      {/* GTM noscript fallback */}
      {smartlink.analytics.gtmId && (
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${smartlink.analytics.gtmId}`}
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {smartlink.coverImage && (
            <div className="mb-6">
              <img
                src={smartlink.coverImage}
                alt={smartlink.title}
                className="w-64 h-64 object-cover rounded-2xl shadow-2xl mx-auto"
              />
            </div>
          )}
          
          <h1 className="text-4xl font-bold mb-2">{smartlink.title}</h1>
          <p className="text-2xl font-medium opacity-80 mb-4">{smartlink.artist}</p>
          
          {smartlink.description && (
            <p className="text-lg opacity-70 mb-4 max-w-lg mx-auto">
              {smartlink.description}
            </p>
          )}
          
          <div className="flex items-center justify-center gap-4 text-sm opacity-60 mb-6">
            {smartlink.releaseDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(smartlink.releaseDate).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={shareSmartlink}
              className="opacity-60 hover:opacity-100"
              style={{ color: smartlink.customization.textColor }}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Partager
            </Button>
          </div>
        </div>

        {/* Platforms */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center mb-6 opacity-90">
            Écoutez sur vos plateformes préférées
          </h2>
          
          {smartlink.platforms.filter(p => p.url).length === 0 ? (
            <Card className="border-0 shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <CardContent className="text-center py-12">
                <Music className="h-12 w-12 opacity-50 mx-auto mb-4" />
                <p className="opacity-70">
                  Aucune plateforme configurée pour ce smartlink.
                </p>
              </CardContent>
            </Card>
          ) : (
            smartlink.platforms
              .filter(platform => platform.url)
              .map(platform => (
                <Button
                  key={platform.id}
                  onClick={() => handlePlatformClick(platform.id, platform.url, platform.name)}
                  className="w-full h-16 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: smartlink.customization.buttonColor,
                    color: smartlink.customization.buttonTextColor,
                    border: 'none'
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={platform.id} size={24} className="text-white" />
                      <span>{platform.name}</span>
                    </div>
                    <ExternalLink className="h-5 w-5 opacity-70" />
                  </div>
                </Button>
              ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 opacity-50">
          <p className="text-sm">
            Généré par www.mdmcmusicads.com
          </p>
        </div>
      </div>
    </div>
  );
}