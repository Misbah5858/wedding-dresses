import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="overlay">
          <div className="container text-center">
            <h1 className="display-2 mb-4">Find Your Perfect Wedding Dress</h1>
            <p className="lead mb-5">
              Discover our exclusive collection of elegant wedding dresses
            </p>
            <Link to="/shop" className="btn btn-lg btn-primary px-5 py-3">
              <i className="bi bi-heart me-2"></i>
              Explore Collection
            </Link>
          </div>
        </div>
      </div>

      <section className="features-section py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <i className="bi bi-heart-fill feature-icon"></i>
                <h3>Elegant Designs</h3>
                <p>Handcrafted dresses for your special day</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <i className="bi bi-star-fill feature-icon"></i>
                <h3>Premium Quality</h3>
                <p>Finest materials and expert craftsmanship</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <i className="bi bi-gem feature-icon"></i>
                <h3>Perfect Fit</h3>
                <p>Custom sizing and professional alterations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">Our Collections</h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="category-card ball-gown">
                <div className="content">
                  <h3>Ball Gowns</h3>
                  <p>Traditional princess-style elegance</p>
                  <Link to="/shop?category=1" className="btn btn-outline-light">
                    View Collection
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="category-card a-line">
                <div className="content">
                  <h3>A-Line Dresses</h3>
                  <p>Timeless and flattering</p>
                  <Link to="/shop?category=2" className="btn btn-outline-light">
                    View Collection
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="category-card mermaid">
                <div className="content">
                  <h3>Mermaid Style</h3>
                  <p>Stunning and sophisticated</p>
                  <Link to="/shop?category=3" className="btn btn-outline-light">
                    View Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section py-5">
        <div className="container text-center">
          <h2 className="mb-4">Ready to Find Your Dream Dress?</h2>
          <p className="mb-4">
            Browse our collection and discover the perfect dress for your
            special day
          </p>
          <Link to="/shop" className="btn btn-lg btn-primary px-5">
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
