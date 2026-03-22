import { gql } from '@apollo/client'

export const HERO_BLOCK_FRAGMENT = gql`
  fragment HeroBlockFields on HeroBlock {
    _type
    _key
    title
    subtitle
    image {
      asset {
        _id
        url
        metadata {
          dimensions {
            width
            height
          }
        }
      }
      alt
      hotspot {
        x
        y
      }
    }
    cta {
      label
      href
    }
  }
`

export const RICH_TEXT_BLOCK_FRAGMENT = gql`
  fragment RichTextBlockFields on RichTextBlock {
    _type
    _key
    contentRaw
  }
`

export const FEATURE_GRID_BLOCK_FRAGMENT = gql`
  fragment FeatureGridBlockFields on FeatureGridBlock {
    _type
    _key
    heading
    features {
      _key
      icon
      title
      description
    }
  }
`

export const TESTIMONIALS_BLOCK_FRAGMENT = gql`
  fragment TestimonialsBlockFields on TestimonialsBlock {
    _type
    _key
    heading
    testimonials {
      _key
      quote
      author
      role
      avatar {
        asset {
          _id
          url
        }
        alt
      }
    }
  }
`

export const CALL_TO_ACTION_BLOCK_FRAGMENT = gql`
  fragment CallToActionBlockFields on CallToActionBlock {
    _type
    _key
    heading
    subheading
    buttonLabel
    buttonHref
    backgroundColor
    textColor
  }
`

export const STATS_BLOCK_FRAGMENT = gql`
  fragment StatsBlockFields on StatsBlock {
    _type
    _key
    heading
    stats {
      _key
      value
      label
      description
    }
  }
`
