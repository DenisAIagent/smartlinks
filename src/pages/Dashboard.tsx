// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SmartlinkCard } from '@/components/SmartlinkCard';
import { PlatformAnalytics } from '@/components/PlatformAnalytics';
import { Smartlink } from '@/types/smartlink';
import { Plus, Search, Link, Eye, MousePointer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://y0h0i3cye1j1.manus.space/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [smartlinks, setSmartlinks] = useState<Smartlink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSmartlinks, setFilteredSmartlinks] = useState<Smartlink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSmartlinks();
  }, []);

  const loadSmartlinks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/smartlinks`);
      if (response.ok) {
        const data = await response.json();
        // Transformer les données de l'API pour correspondre au format frontend
        const transformedData = data.map((item: any) => ({
          id: item.id,
          title: item.title || '',
          description: item.description || '',
          artist: item.landing_page_subtitle || '',
          releaseDate: '',
          coverImage: item.cover_image_url || '',
          platforms: item.platforms || [],
          analytics: { gtmId: '', ga4Id: '' },
          customization: {
            backgroundColor: '#ffffff',
            textColor: '#000000',
            buttonColor: '#3b82f6',
            buttonTextColor: '#ffffff'
          },
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          views: item.views || 0,
          clicks: item.platforms?.reduce((acc: any, platform: any, index: number) => {
            acc[platform.name] = platform.clicks || 0;
            return acc;
          }, {}) || {},
          landing_page_title: item.landing_page_title,
          landing_page_subtitle: item.landing_page_subtitle,
          cover_image_url: item.cover_image_url,
          embed_url: item.embed_url,
          long_description: item.long_description,
          social_sharing_enabled: item.social_sharing_enabled
        }));
        setSmartlinks(transformedData);
        setFilteredSmartlinks(transformedData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des smartlinks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = smartlinks.filter(smartlink =>
      smartlink.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      smartlink.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      smartlink.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSmartlinks(filtered);
  }, [searchTerm, smartlinks]);

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const totalViews = smartlinks.reduce((sum, link) => sum + link.views, 0);
  const totalClicks = smartlinks.reduce((sum, link) => 
    sum + Object.values(link.clicks).reduce((clickSum, clicks) => clickSum + clicks, 0), 0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Mes Smartlinks
              </h1>
              <p className="text-slate-600">
                Gérez vos liens intelligents pour vos sorties musicales
              </p>
            </div>
            <Button 
              onClick={() => navigate('/create')}
              size="lg"
              className="shadow-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nouveau Smartlink
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Smartlinks</CardTitle>
                <Link className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{smartlinks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vues</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clics</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClicks}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Rechercher vos smartlinks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Platform Analytics */}
        {smartlinks.length > 0 && (
          <div className="mb-8">
            <PlatformAnalytics smartlinks={smartlinks} />
          </div>
        )}

        {/* Content */}
        {filteredSmartlinks.length === 0 ? (
          <Card className="py-16">
            <CardContent className="text-center">
              {smartlinks.length === 0 ? (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <Link className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Aucun smartlink créé
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Commencez par créer votre premier smartlink pour partager votre musique sur toutes les plateformes.
                    </p>
                    <Button onClick={() => navigate('/create')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Créer votre premier smartlink
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Aucun résultat trouvé
                    </h3>
                    <p className="text-slate-600">
                      Essayez avec d'autres mots-clés ou créez un nouveau smartlink.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSmartlinks.map(smartlink => (
              <SmartlinkCard
                key={smartlink.id}
                smartlink={smartlink}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

