import { Metadata } from 'next'

export interface MetadataConfig {
  title?: string
  description?: string
  siteName?: string
  twitterHandle?: string
  verificationCodes?: {
    google?: string
    yandex?: string
  }
}