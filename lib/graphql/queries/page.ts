import { gql } from '@apollo/client'
import {
  HERO_BLOCK_FRAGMENT,
  RICH_TEXT_BLOCK_FRAGMENT,
  FEATURE_GRID_BLOCK_FRAGMENT,
  TESTIMONIALS_BLOCK_FRAGMENT,
  CALL_TO_ACTION_BLOCK_FRAGMENT,
  STATS_BLOCK_FRAGMENT,
} from '../fragments/blocks'

export const GET_PAGE_BY_SLUG = gql`
  ${HERO_BLOCK_FRAGMENT}
  ${RICH_TEXT_BLOCK_FRAGMENT}
  ${FEATURE_GRID_BLOCK_FRAGMENT}
  ${TESTIMONIALS_BLOCK_FRAGMENT}
  ${CALL_TO_ACTION_BLOCK_FRAGMENT}
  ${STATS_BLOCK_FRAGMENT}

  query GetPageBySlug($slug: String!) {
    allPage(where: { slug: { current: { eq: $slug } } }) {
      _id
      title
      slug {
        current
      }
      seoDescription
      blocks {
        ... on HeroBlock {
          ...HeroBlockFields
        }
        ... on RichTextBlock {
          ...RichTextBlockFields
        }
        ... on FeatureGridBlock {
          ...FeatureGridBlockFields
        }
        ... on TestimonialsBlock {
          ...TestimonialsBlockFields
        }
        ... on CallToActionBlock {
          ...CallToActionBlockFields
        }
        ... on StatsBlock {
          ...StatsBlockFields
        }
      }
    }
  }
`

export const GET_ALL_PAGE_SLUGS = gql`
  query GetAllPageSlugs {
    allPage {
      slug {
        current
      }
    }
  }
`
