import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [`${process.env.NEXT_PUBLIC_SANITY_GRAPHQL_ENDPOINT}`]: {
      headers: {
        Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
      },
    },
  },
  documents: ['lib/graphql/**/*.ts', '!lib/graphql/__generated__/**'],
  generates: {
    'lib/graphql/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false,
      },
    },
  },
}

export default config
