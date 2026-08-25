export default async () => {
  // Ensure TransformStream is available globally for Playwright tests
  await import('web-streams-polyfill');
};
