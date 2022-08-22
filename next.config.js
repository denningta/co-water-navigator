module.exports = (phase, { defaultConfig }) => {
  /** @type {import('next').NextConfig} */
  
  fetch(`http://localhost:3000/api/v1/meter-readings/stream`)

  const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['lh3.googleusercontent.com']
    }
  }

  return nextConfig;
}

