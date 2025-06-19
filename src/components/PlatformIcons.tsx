// src/components/PlatformIcons.tsx
import React from 'react';
import { Icon } from '@iconify/react';

export interface PlatformIconProps {
  platform: string;
  size?: number;
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ 
  platform, 
  size = 20, 
  className = '' 
}) => {
  const iconMap: Record<string, string> = {
    spotify: 'simple-icons:spotify',
    'apple-music': 'simple-icons:applemusic',
    appleMusic: 'simple-icons:applemusic',
    youtube: 'simple-icons:youtube',
    'youtube-music': 'simple-icons:youtubemusic',
    youtubeMusic: 'simple-icons:youtubemusic',
    deezer: 'simple-icons:deezer',
    soundcloud: 'simple-icons:soundcloud',
    tidal: 'simple-icons:tidal',
    'amazon-music': 'simple-icons:amazonmusic',
    amazonMusic: 'simple-icons:amazonmusic',
    pandora: 'simple-icons:pandora',
    napster: 'simple-icons:napster',
    audiomack: 'simple-icons:audiomack',
    anghami: 'simple-icons:anghami',
    boomplay: 'simple-icons:boomplay',
    bandcamp: 'simple-icons:bandcamp',
    shazam: 'simple-icons:shazam',
    'last-fm': 'simple-icons:lastdotfm',
    lastfm: 'simple-icons:lastdotfm',
  };

  const iconName = iconMap[platform.toLowerCase()] || 'simple-icons:musicbrainz';

  return (
    <Icon 
      icon={iconName} 
      width={size} 
      height={size} 
      className={className}
    />
  );
};

export interface PlatformConfig {
  id: string;
  name: string;
  color: string;
  iconName: string;
}

export const platformConfigs: PlatformConfig[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    color: '#1DB954',
    iconName: 'simple-icons:spotify',
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    color: '#FA243C',
    iconName: 'simple-icons:applemusic',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    iconName: 'simple-icons:youtube',
  },
  {
    id: 'youtube-music',
    name: 'YouTube Music',
    color: '#FF0000',
    iconName: 'simple-icons:youtubemusic',
  },
  {
    id: 'deezer',
    name: 'Deezer',
    color: '#FEAA2D',
    iconName: 'simple-icons:deezer',
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    color: '#FF5500',
    iconName: 'simple-icons:soundcloud',
  },
  {
    id: 'tidal',
    name: 'Tidal',
    color: '#000000',
    iconName: 'simple-icons:tidal',
  },
  {
    id: 'amazon-music',
    name: 'Amazon Music',
    color: '#00A8E1',
    iconName: 'simple-icons:amazonmusic',
  },
  {
    id: 'pandora',
    name: 'Pandora',
    color: '#005483',
    iconName: 'simple-icons:pandora',
  },
  {
    id: 'napster',
    name: 'Napster',
    color: '#00B9FF',
    iconName: 'simple-icons:napster',
  },
  {
    id: 'audiomack',
    name: 'Audiomack',
    color: '#FF6600',
    iconName: 'simple-icons:audiomack',
  },
  {
    id: 'anghami',
    name: 'Anghami',
    color: '#662D91',
    iconName: 'simple-icons:anghami',
  },
  {
    id: 'boomplay',
    name: 'Boomplay',
    color: '#FF6B35',
    iconName: 'simple-icons:boomplay',
  },
  {
    id: 'bandcamp',
    name: 'Bandcamp',
    color: '#629AA0',
    iconName: 'simple-icons:bandcamp',
  },
];

export const getPlatformConfig = (platformId: string): PlatformConfig | undefined => {
  return platformConfigs.find(config => 
    config.id === platformId || 
    config.id === platformId.toLowerCase() ||
    config.name.toLowerCase() === platformId.toLowerCase()
  );
};

export const PlatformButton: React.FC<{
  platform: PlatformConfig;
  url?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ platform, url, onClick, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!url && !onClick}
      className={`
        inline-flex items-center gap-2 rounded-lg font-medium transition-all
        ${sizeClasses[size]}
        ${!url && !onClick ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:scale-105'}
        ${className}
      `}
      style={{
        backgroundColor: platform.color,
        color: '#ffffff',
      }}
    >
      <Icon 
        icon={platform.iconName} 
        width={iconSizes[size]} 
        height={iconSizes[size]} 
      />
      {platform.name}
    </button>
  );
};

export default PlatformIcon;