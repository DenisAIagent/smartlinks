// src/components/MagicLinkGenerator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Link2, CheckCircle, AlertCircle, Music } from 'lucide-react';
import { odesliService, SmartlinkData } from '@/lib/odesli';

interface MagicLinkGeneratorProps {
  onDataGenerated: (data: SmartlinkData) => void;
  disabled?: boolean;
}

export const MagicLinkGenerator: React.FC<MagicLinkGeneratorProps> = ({
  onDataGenerated,
  disabled = false,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputUrl.trim()) {
      setError('Veuillez entrer un lien musical');
      return;
    }

    if (!odesliService.isValidMusicUrl(inputUrl)) {
      setError('Veuillez entrer un lien valide (Spotify, Apple Music, YouTube, etc.)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await odesliService.fetchSmartlinkData(inputUrl);
      
      // Count how many platforms were found
      const platformCount = Object.values(data.platforms).filter(Boolean).length;
      
      onDataGenerated(data);
      setSuccess(`✨ ${platformCount} plateformes détectées ! Métadonnées automatiquement remplies.`);
      setInputUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInputUrl(value);
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const exampleUrls = [
    'https://open.spotify.com/track/...',
    'https://music.apple.com/album/...',
    'https://www.youtube.com/watch?v=...',
    'https://deezer.com/track/...',
  ];

  return (
    <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Sparkles className="h-5 w-5" />
          Magic Link Generator
          <Badge variant="secondary" className="ml-2">
            Powered by Odesli
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Collez n'importe quel lien musical et générez automatiquement tous les liens des autres plateformes
          </p>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Collez votre lien musical ici..."
                value={inputUrl}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={disabled || isLoading}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={disabled || isLoading || !inputUrl.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Générer
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Music className="h-4 w-4" />
            Plateformes supportées :
          </div>
          
          <div className="flex flex-wrap gap-1">
            {odesliService.getAvailablePlatforms().map((platform) => (
              <Badge key={platform.key} variant="outline" className="text-xs">
                {platform.name}
              </Badge>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Exemples d'URLs acceptées :</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
              {exampleUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-1 text-muted-foreground">
                  <Link2 className="h-3 w-3" />
                  <code className="bg-muted px-1 rounded text-xs">{url}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};