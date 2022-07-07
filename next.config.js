module.exports = (phase, { defaultConfig }) => {
  /** @type {import('next').NextConfig} */
  
  // fetch(`http://localhost:3000/api/v1/meter-readings/stream`).then(res => console.log(res))

  const nextConfig = {
    reactStrictMode: true,
  }

  return nextConfig;
}

