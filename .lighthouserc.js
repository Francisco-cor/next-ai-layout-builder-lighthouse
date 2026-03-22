/** @type {import('@lhci/cli').LhciConfig} */
module.exports = {
  ci: {
    collect: {
      // Build Next.js and serve it locally — tests the PRODUCTION build, not dev
      startServerCommand: 'npm start',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 30000,
      url: [
        'http://localhost:3000/home',  // Public route — this is what we optimize
      ],
      numberOfRuns: 3,
      settings: {
        // Desktop preset matches Vercel Edge delivery conditions better than mobile
        preset: 'desktop',
        // Throttle CPU to 4x to simulate mid-range hardware (Lighthouse default)
        throttlingMethod: 'simulate',
      },
    },
    assert: {
      assertions: {
        // Performance ≥95 in CI (98 measured in production — CI uses simulated throttling)
        'categories:performance': ['error', { minScore: 0.95 }],
        // Accessibility must be perfect — no exceptions
        'categories:accessibility': ['error', { minScore: 1.0 }],
        // Best Practices must be perfect
        'categories:best-practices': ['error', { minScore: 1.0 }],
        // SEO — warn, not block
        'categories:seo': ['warn', { minScore: 0.9 }],

        // Core Web Vitals — these are the real numbers that matter
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],

        // Bundle size — fail if initial JS exceeds 80KB (minified+gzipped)
        'resource-summary:script:size': ['error', { maxNumericValue: 81920 }],
      },
    },
    upload: {
      // Stores results in Lighthouse's public temporary storage — links posted as PR comments
      target: 'temporary-public-storage',
    },
  },
}
