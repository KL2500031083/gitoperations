import { useMemo, useState } from 'react'
import './App.css'

const categories = [
  { name: 'All', icon: '✦' },
  { name: 'Burgers', icon: '🍔' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Asian', icon: '🍜' },
  { name: 'Healthy', icon: '🥗' },
  { name: 'Desserts', icon: '🍰' },
]

const dishes = [
  {
    name: 'Truffle Smash Burger',
    restaurant: 'The Burger House',
    category: 'Burgers',
    price: '$14.90',
    rating: '4.9',
    time: '20–25 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
    tag: 'Best seller',
  },
  {
    name: 'Burrata Margherita',
    restaurant: 'Sorella Pizzeria',
    category: 'Pizza',
    price: '$18.50',
    rating: '4.8',
    time: '25–30 min',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85',
    tag: 'Chef’s pick',
  },
  {
    name: 'Salmon Poke Bowl',
    restaurant: 'Mizu Kitchen',
    category: 'Healthy',
    price: '$16.00',
    rating: '4.9',
    time: '15–20 min',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
    tag: 'Fresh today',
  },
  {
    name: 'Crispy Chicken Ramen',
    restaurant: 'Nori & Co.',
    category: 'Asian',
    price: '$15.25',
    rating: '4.7',
    time: '20–25 min',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85',
    tag: 'Popular',
  },
  {
    name: 'Salted Caramel Tart',
    restaurant: 'Maison Sucré',
    category: 'Desserts',
    price: '$8.75',
    rating: '4.8',
    time: '15–20 min',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85',
    tag: 'Sweet treat',
  },
  {
    name: 'Spicy Tuna Crunch',
    restaurant: 'Mizu Kitchen',
    category: 'Asian',
    price: '$13.90',
    rating: '4.8',
    time: '15–20 min',
    image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=900&q=85',
    tag: 'New',
  },
]

function App() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [cartCount, setCartCount] = useState(0)
  const [saved, setSaved] = useState([])

  const visibleDishes = useMemo(
    () =>
      activeCategory === 'All'
        ? dishes
        : dishes.filter((dish) => dish.category === activeCategory),
    [activeCategory],
  )

  const toggleSaved = (dishName) => {
    setSaved((current) =>
      current.includes(dishName)
        ? current.filter((name) => name !== dishName)
        : [...current, dishName],
    )
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Bite Club home">
          <span className="brand-mark">B</span>
          <span>Bite<span>Club</span></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="active" href="#discover">Discover</a>
          <a href="#offers">Offers</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <div className="top-actions">
          <button className="location-button" type="button" aria-label="Change delivery location">
            <span>⌖</span> Brooklyn, NY <span className="chevron">⌄</span>
          </button>
          <button className="cart-button" type="button" aria-label={`${cartCount} items in cart`}>
            <span className="bag-icon">♧</span>
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
          <button className="avatar" type="button" aria-label="Open profile">JD</button>
        </div>
      </header>

      <main id="top">
        <section className="hero" id="discover">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Fresh food, happy mood</p>
            <h1>Your next<br /><em>favorite</em> meal<br />is here.</h1>
            <p className="hero-description">
              Discover hand-picked dishes from the best local spots, delivered right to your door.
            </p>
            <div className="search-bar">
              <span className="search-icon">⌕</span>
              <input type="search" placeholder="What are you craving?" aria-label="Search for food" />
              <button type="button">Search</button>
            </div>
            <div className="hero-note"><span className="sparkle">✦</span> No delivery fee on your first order</div>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <img src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85" alt="A colorful table of fresh food" />
            <div className="floating-card delivery-card"><span className="delivery-icon">⌁</span><div><strong>30 min</strong><small>average delivery</small></div></div>
            <div className="floating-card rating-card"><span>★</span><div><strong>4.9 / 5</strong><small>from food lovers</small></div></div>
          </div>
        </section>

        <section className="content-section categories-section" id="how-it-works">
          <div className="section-heading">
            <div><p className="eyebrow">Browse by craving</p><h2>What are you in the mood for?</h2></div>
            <a className="text-link" href="#menu">View all <span>→</span></a>
          </div>
          <div className="category-list" role="list">
            {categories.map((category) => (
              <button
                className={`category-pill ${activeCategory === category.name ? 'selected' : ''}`}
                type="button"
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
              >
                <span className="category-icon">{category.icon}</span>{category.name}
              </button>
            ))}
          </div>
        </section>

        <section className="content-section menu-section" id="menu">
          <div className="section-heading">
            <div><p className="eyebrow">Curated for you</p><h2>Popular near you <span className="sun">✦</span></h2></div>
            <div className="carousel-actions"><button type="button" aria-label="Previous dishes">←</button><button type="button" aria-label="Next dishes">→</button></div>
          </div>
          <div className="dish-grid">
            {visibleDishes.map((dish) => (
              <article className="dish-card" key={dish.name}>
                <div className="dish-image-wrap">
                  <img src={dish.image} alt={dish.name} className="dish-image" />
                  <span className="dish-tag">{dish.tag}</span>
                  <button className={`save-button ${saved.includes(dish.name) ? 'saved' : ''}`} type="button" onClick={() => toggleSaved(dish.name)} aria-label={`Save ${dish.name}`}>
                    {saved.includes(dish.name) ? '♥' : '♡'}
                  </button>
                </div>
                <div className="dish-details">
                  <div className="dish-title-row"><h3>{dish.name}</h3><strong>{dish.price}</strong></div>
                  <p className="restaurant">{dish.restaurant}</p>
                  <div className="dish-meta"><span className="rating">★ {dish.rating}</span><span>·</span><span>{dish.time}</span><button type="button" onClick={() => setCartCount((count) => count + 1)} aria-label={`Add ${dish.name} to cart`}>+</button></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="offer-banner" id="offers">
          <div className="offer-copy"><p className="eyebrow">A little something extra</p><h2>Good food tastes even better<br /><em>with a deal.</em></h2><p>Get 25% off your first three orders with code <strong>WELCOME25</strong></p><button type="button">Claim offer <span>→</span></button></div>
          <div className="offer-art"><span className="offer-sticker">25%<small>OFF</small></span><div className="offer-circle"><span>WELCOME</span><strong>25</strong><small>your first 3 orders</small></div></div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div><a className="brand footer-brand" href="#top"><span className="brand-mark">B</span><span>Bite<span>Club</span></span></a><p>Good food, good mood,<br />good company.</p></div>
          <div className="footer-links"><div><h3>Explore</h3><a href="#discover">Discover</a><a href="#offers">Offers</a><a href="#how-it-works">How it works</a></div><div><h3>Need help?</h3><a href="mailto:hello@biteclub.co">hello@biteclub.co</a><a href="tel:+12125550148">+1 212 555 0148</a><a href="#top">FAQ</a></div><div><h3>Follow along</h3><a href="#top">Instagram</a><a href="#top">TikTok</a><a href="#top">Twitter</a></div></div>
        </div>
        <div className="footer-bottom"><span>© 2024 BiteClub. Made with appetite.</span><span><a href="#top">Privacy</a><a href="#top">Terms</a></span></div>
      </footer>
    </div>
  )
}

export default App
