import { Metadata } from 'next'
import { DEFAULT_METADATA } from './defaults'
import { MetadataConfig } from './types'
import { generateTitle, generateOpenGraph, generateTwitterCard } from './generators'

export function generateCommonMetadata(
  title?: string,
  description?: string
): Metadata {
  const config: MetadataConfig = {
    title,
    description: description || DEFAULT_METADATA.description,
  }

  return {
    title: {
      default: generateTitle(title),
      template: '%s | ' + DEFAULT_METADATA.siteName,
    },
    description: config.description,
    keywords: DEFAULT_METADATA.keywords,
    authors: [{ name: DEFAULT_METADATA.company }],
    creator: DEFAULT_METADATA.company,
    publisher: DEFAULT_METADATA.company,
    openGraph: generateOpenGraph(config),
    twitter: generateTwitterCard(config),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: DEFAULT_METADATA.verificationCodes,
  }
}

export * from './types'