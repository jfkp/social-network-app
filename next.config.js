/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // For Google user profile images
      'firebasestorage.googleapis.com', // For Firebase Storage images
      'placehold.co' // For placeholder images
    ],
  },
}

module.exports = nextConfig 