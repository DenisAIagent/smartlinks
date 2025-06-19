// src/components/SmartlinkForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from './ImageUpload';
import { AnalyticsConfig } from './AnalyticsConfig';
import { MagicLinkGenerator } from './MagicLinkGenerator';
import { SmartlinkFormData, Platform } from '@/types/smartlink';
import { SmartlinkData } from '@/lib/odesli';
import { Plus, X, Palette } from 'lucide-react';
import { PlatformIcon, platformConfigs, getPlatformConfig } from './PlatformIcons';

interface SmartlinkFormProps {
  initialData?: Partial<SmartlinkFormData>;
  onSubmit: (data: SmartlinkFormData) => void;
  isLoading?: boolean;
}

const defaultPlatforms: Platform[] = platformConfigs.map(config => ({
  id: config.id,
  name: config.name,
  url: '',
  icon: config.iconName,
  color: config.color
}));

export const SmartlinkForm: React.FC<SmartlinkFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<SmartlinkFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    artist: initialData?.artist || '',
    releaseDate: initialData?.releaseDate || '',
    coverImage: initialData?.coverImage || '',
    platforms: initialData?.platforms || [],
    analytics: {
      gtmId: initialData?.analytics?.gtmId || '',
      ga4Id: initialData?.analytics?.ga4Id || '',
    },
    customization: {
      backgroundColor: initialData?.customization?.backgroundColor || '#ffffff',
      textColor: initialData?.customization?.textColor || '#000000',
      buttonColor: initialData?.customization?.buttonColor || '#3b82f6',
      buttonTextColor: initialData?.customization?.buttonTextColor || '#ffffff',
    },
    // Nouveaux champs pour la page de destination
    landing_page_title: initialData?.landing_page_title || '',
    landing_page_subtitle: initialData?.landing_page_subtitle || '',
    cover_image_url: initialData?.cover_image_url || '',
    embed_url: initialData?.embed_url || '',
    long_description: initialData?.long_description || '',
    social_sharing_enabled: initialData?.social_sharing_enabled !== false,
  });

  const [newPlatform, setNewPlatform] = useState({ name: '', url: '', button_text: 'Play' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transformer les données pour l'API backend
    const apiData = {
      title: formData.title,
      description: formData.description,
      url: formData.platforms[0]?.url || '', // URL principale (première plateforme)
      landing_page_title: formData.landing_page_title || formData.title,
      landing_page_subtitle: formData.landing_page_subtitle || formData.artist,
      cover_image_url: formData.cover_image_url || formData.coverImage,
      embed_url: formData.embed_url,
      long_description: formData.long_description || formData.description,
      social_sharing_enabled: formData.social_sharing_enabled,
      platforms: formData.platforms.map(platform => ({
        name: platform.name,
        url: platform.url,
        button_text: platform.button_text || 'Play',
        icon: platform.icon,
        color: platform.color
      }))
    };
    
    onSubmit(apiData);
  };

  const handleMagicLinkGenerated = (data: SmartlinkData) => {
    setFormData(prev => ({
      ...prev,
      title: data.title,
      artist: data.artist,
      coverImage: data.imageUrl,
      cover_image_url: data.imageUrl,
      landing_page_title: data.title,
      landing_page_subtitle: data.artist,
      platforms: [
        ...prev.platforms,
        ...Object.entries(data.platforms)
          .filter(([_, url]) => url)
          .map(([key, url]) => {
            const config = getPlatformConfig(key);
            return {
              id: key,
              name: config?.name || key,
              url: url,
              icon: config?.iconName || '🎵',
              color: config?.color || '#6b7280',
              button_text: 'Play'
            };
          })
          .filter(platform => !prev.platforms.some(p => p.id === platform.id))
      ]
    }));
  };

  const addPlatformFromDefault = (platform: Platform) => {
    if (!formData.platforms.find(p => p.id === platform.id)) {
      setFormData(prev => ({
        ...prev,
        platforms: [...prev.platforms, { ...platform, url: '', button_text: 'Play' }]
      }));
    }
  };

  const addCustomPlatform = () => {
    if (newPlatform.name && newPlatform.url) {
      const platform: Platform = {
        id: `custom-${Date.now()}`,
        name: newPlatform.name,
        url: newPlatform.url,
        icon: '🔗',
        color: '#6b7280',
        button_text: newPlatform.button_text
      };
      setFormData(prev => ({
        ...prev,
        platforms: [...prev.platforms, platform]
      }));
      setNewPlatform({ name: '', url: '', button_text: 'Play' });
    }
  };

  const removePlatform = (id: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.filter(p => p.id !== id)
    }));
  };

  const updatePlatform = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Magic Link Generator */}
      <MagicLinkGenerator 
        onDataGenerated={handleMagicLinkGenerated}
        disabled={isLoading}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artiste *</Label>
                <Input
                  id="artist"
                  value={formData.artist}
                  onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="release-date">Date de sortie</Label>
              <Input
                id="release-date"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Image de couverture</Label>
              <ImageUpload
                value={formData.coverImage}
                onChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  coverImage: value,
                  cover_image_url: value 
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuration de la page de destination */}
        <Card>
          <CardHeader>
            <CardTitle>Page de destination personnalisée</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="landing-title">Titre de la page</Label>
                <Input
                  id="landing-title"
                  value={formData.landing_page_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, landing_page_title: e.target.value }))}
                  placeholder="Laissez vide pour utiliser le titre principal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landing-subtitle">Sous-titre</Label>
                <Input
                  id="landing-subtitle"
                  value={formData.landing_page_subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, landing_page_subtitle: e.target.value }))}
                  placeholder="Laissez vide pour utiliser l'artiste"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="embed-url">URL d'intégration (YouTube, Spotify, etc.)</Label>
              <Input
                id="embed-url"
                value={formData.embed_url}
                onChange={(e) => setFormData(prev => ({ ...prev, embed_url: e.target.value }))}
                placeholder="https://www.youtube.com/embed/..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="long-description">Description longue</Label>
              <Textarea
                id="long-description"
                value={formData.long_description}
                onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
                rows={4}
                placeholder="Description détaillée pour la page de destination"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="social-sharing"
                checked={formData.social_sharing_enabled}
                onChange={(e) => setFormData(prev => ({ ...prev, social_sharing_enabled: e.target.checked }))}
              />
              <Label htmlFor="social-sharing">Activer le partage social</Label>
            </div>
          </CardContent>
        </Card>

        {/* Plateformes */}
        <Card>
          <CardHeader>
            <CardTitle>Plateformes de streaming</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {defaultPlatforms.map(platform => (
                <Button
                  key={platform.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addPlatformFromDefault(platform)}
                  disabled={formData.platforms.some(p => p.id === platform.id)}
                >
                  <PlatformIcon platform={platform.id} size={16} className="mr-2" />
                  {platform.name}
                  <Plus className="ml-2 h-3 w-3" />
                </Button>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex gap-2">
              <Input
                placeholder="Nom de la plateforme"
                value={newPlatform.name}
                onChange={(e) => setNewPlatform(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="URL"
                value={newPlatform.url}
                onChange={(e) => setNewPlatform(prev => ({ ...prev, url: e.target.value }))}
              />
              <Input
                placeholder="Texte du bouton"
                value={newPlatform.button_text}
                onChange={(e) => setNewPlatform(prev => ({ ...prev, button_text: e.target.value }))}
              />
              <Button type="button" onClick={addCustomPlatform}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.platforms.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Plateformes ajoutées :</h4>
                {formData.platforms.map(platform => (
                  <div key={platform.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <PlatformIcon platform={platform.id} size={14} />
                      {platform.name}
                    </Badge>
                    <Input
                      placeholder="URL de la plateforme"
                      value={platform.url}
                      onChange={(e) => updatePlatform(platform.id, 'url', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Texte du bouton"
                      value={platform.button_text || 'Play'}
                      onChange={(e) => updatePlatform(platform.id, 'button_text', e.target.value)}
                      className="w-32"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePlatform(platform.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personnalisation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Personnalisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bg-color">Couleur de fond</Label>
                <div className="flex gap-2">
                  <Input
                    id="bg-color"
                    type="color"
                    value={formData.customization.backgroundColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, backgroundColor: e.target.value }
                    }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={formData.customization.backgroundColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, backgroundColor: e.target.value }
                    }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="text-color">Couleur du texte</Label>
                <div className="flex gap-2">
                  <Input
                    id="text-color"
                    type="color"
                    value={formData.customization.textColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, textColor: e.target.value }
                    }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={formData.customization.textColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, textColor: e.target.value }
                    }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="button-color">Couleur des boutons</Label>
                <div className="flex gap-2">
                  <Input
                    id="button-color"
                    type="color"
                    value={formData.customization.buttonColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, buttonColor: e.target.value }
                    }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={formData.customization.buttonColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, buttonColor: e.target.value }
                    }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="button-text-color">Couleur du texte des boutons</Label>
                <div className="flex gap-2">
                  <Input
                    id="button-text-color"
                    type="color"
                    value={formData.customization.buttonTextColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, buttonTextColor: e.target.value }
                    }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={formData.customization.buttonTextColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customization: { ...prev.customization, buttonTextColor: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <AnalyticsConfig
          gtmId={formData.analytics.gtmId || ''}
          ga4Id={formData.analytics.ga4Id || ''}
          onGtmChange={(value) => setFormData(prev => ({
            ...prev,
            analytics: { ...prev.analytics, gtmId: value }
          }))}
          onGa4Change={(value) => setFormData(prev => ({
            ...prev,
            analytics: { ...prev.analytics, ga4Id: value }
          }))}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer le smartlink'}
        </Button>
      </form>
    </div>
  );
};

