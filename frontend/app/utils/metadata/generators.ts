import { Metadata } from 'next'
import { DEFAULT_METADATA } from './defaults'
import { MetadataConfig } from './types'

export function generateTitle(title?: string): string {
  return title ? `${title} | ${DEFAULT_METADATA.siteName}` : DEFAULT_METADATA.siteName
}

export function generateOpenGraph(config: MetadataConfig) {
  const title = generateTitle(config.title)
  const description = config.description || DEFAULT_METADATA.description

  return {
    type: 'website',
    locale: 'en_US',
    siteName: DEFAULT_METADATA.siteName,
    title,
    description,
  }
}

export function generateTwitterCard(config: MetadataConfig) {
  const title = generateTitle(config.title)
  const description = config.description || DEFAULT_METADATA.description

  return {
    card: 'summary_large_image',
    title,
    description,
    creator: config.twitterHandle || DEFAULT_METADATA.twitterHandle,
  }
}