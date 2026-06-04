export type ThemeType = 'wallpaper' | 'code' | 'mixed';

export type ThemeItem = {
  id: string;
  title: string;
  description?: string;
  type: ThemeType;
  tags: string[];
  previewImage?: string;
  downloadUrl?: string;
  voteUrl?: string;
  favoriteCount?: number;
  theme: Record<string, unknown>;
};

export type LanguagePack = {
  code: string;
  name: string;
  labels: Record<string, string>;
};
