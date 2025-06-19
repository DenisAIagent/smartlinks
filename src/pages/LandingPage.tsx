// src/pages/LandingPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, ExternalLink, Play } from 'lucide-react';
import { LandingPageData, Platform } from '@/types/smartlink';
import { PlatformIcon } from '@/components/PlatformIcons';

const API_BASE_URL = 'https://smartlinks-backend-production.up.railway.app/api';

export default function LandingPage() {
  const { id } = useParams<{ id: string }>();
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchLandingData(id);
    }
  }, [id]);

  const fetchLandingData = async (smartlinkId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/smartlinks/${smartlinkId}/landing`);
      if (!response.ok) {
        throw new Error('Smartlink non trouvé');
      }
      const data = await response.json();
      setLandingData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformClick = async (platform: Platform, index: number) => {
    if (!id) return;
    
    try {
      // Enregistrer le clic
      await fetch(`${API_BASE_URL}/smartlinks/${id}/platforms/${index}/click`, {
        method: 'POST'
      });
      
      // Rediriger vers la plateforme
      window.open(platform.url, '_blank');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du clic:', err);
      // Rediriger quand même
      window.open(platform.url, '_blank');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = landingData?.landing_page_title || 'Découvrez cette musique';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier l'URL
      navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (error || !landingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">{error || 'Smartlink non trouvé'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header avec image de couverture */}
        <div className="text-center mb-8">
          {landingData.cover_image_url && (
            <div className="mb-6">
              <img
                src={landingData.cover_image_url}
                alt={landingData.landing_page_title}
                className="w-64 h-64 mx-auto rounded-lg shadow-2xl object-cover"
              />
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-white mb-2">
            {landingData.landing_page_title}
          </h1>
          
          {landingData.landing_page_subtitle && (
            <p className="text-xl text-slate-300 mb-4">
              {landingData.landing_page_subtitle}
            </p>
          )}
          
          <div className="text-sm text-slate-400">
            Choisissez votre service de musique
          </div>
        </div>

        {/* Lecteur intégré */}
        {landingData.embed_url && (
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="aspect-video">
                <iframe
                  src={landingData.embed_url}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des plateformes */}
        <div className="space-y-3 mb-8">
          {landingData.platforms.map((platform, index) => (
            <Card
              key={platform.id}
              className="bg-white hover:bg-slate-50 transition-colors cursor-pointer border-2 hover:border-slate-300"
              onClick={() => handlePlatformClick(platform, index)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100">
                      <PlatformIcon platform={platform.id || ''} size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {platform.name || ''}
                      </h3>
                      {platform.clicks && platform.clicks > 0 && (
                        <p className="text-sm text-slate-500">
                          {platform.clicks} écoutes
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlatformClick(platform, index);
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {platform.button_text || 'Play'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Description longue */}
        {landingData.long_description && (
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                À propos
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {landingData.long_description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Bouton de partage */}
        {landingData.social_sharing_enabled && (
          <div className="text-center mb-8">
            <Button
              variant="outline"
              onClick={handleShare}
              className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        )}

        {/* Footer avec statistiques */}
        <div className="text-center text-slate-400 text-sm">
          <div className="flex justify-center space-x-6">
            <span>{landingData.views} vues</span>
            <span>{landingData.clicks} clics</span>
          </div>
        </div>
      </div>
    </div>
  );
}

