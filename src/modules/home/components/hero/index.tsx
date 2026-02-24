import HeroSlider from "./hero-slider"

type HeroProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  description: string | null
  price?: string
}

const Hero = ({ products }: { products?: HeroProduct[] }) => {
  if (!products || products.length === 0) {
    return null
  }

  return <HeroSlider products={products} />
}

export default Hero
