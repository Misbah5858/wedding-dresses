/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ShowAll = () => {
  const [dresses, setDresses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3000/dresses"),
      axios.get("http://localhost:3000/categories"),
    ])
      .then(([dressesRes, categoriesRes]) => {
        setDresses(dressesRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load dresses. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setLoading(true);

    const url = categoryId
      ? `http://localhost:3000/dresses?category_id=${categoryId}`
      : "http://localhost:3000/dresses";

    axios
      .get(url)
      .then((response) => {
        setDresses(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dresses:", err);
        setError("Failed to load dresses");
        setLoading(false);
      });
  };

  const filteredDresses = dresses.filter(
    (dress) =>
      dress.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dress.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="display-4">Elegant Wedding Dresses</h1>
          <p className="lead">Find your perfect dress for your special day</p>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search dresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>{" "}
          <div className="col-md-4 text-end">
            <Link to="/manage-dresses" className="btn btn-secondary me-2">
              <i className="bi bi-gear me-2"></i>Manage Dresses
            </Link>
            <Link to="/orders" className="btn btn-info me-2">
              <i className="bi bi-list-check me-2"></i>Orders
            </Link>
          </div>
        </div>

        {filteredDresses.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No dresses found matching your criteria.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredDresses.map((dress) => (
              <div key={dress.id} className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{dress.name}</h5>
                    <div className="price-section mb-3">
                      {dress.discount_percentage > 0 ? (
                        <>
                          <p className="card-text mb-0">
                            <span className="text-decoration-line-through text-muted">
                              PKR {dress.price.toLocaleString()}
                            </span>
                            <span className="badge bg-danger ms-2">
                              -{dress.discount_percentage}%
                            </span>
                          </p>
                          <p className="card-text dress-price">
                            PKR {dress.discounted_price.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="card-text dress-price">
                          PKR {dress.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="mb-3">
                      <span className="badge bg-secondary me-2">
                        {dress.category_name}
                      </span>
                      <span className="badge bg-info">{dress.style}</span>
                    </div>
                    <p className="card-text">{dress.description}</p>
                    <div className="mb-3">
                      <small className="text-muted">
                        <i className="bi bi-palette me-2"></i>
                        Color: {dress.color}
                      </small>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">
                        <i className="bi bi-rulers me-2"></i>
                        Available Sizes:{" "}
                        {JSON.parse(dress.size_available).join(", ")}
                      </small>
                    </div>
                    <div className="mb-3">
                      <small
                        className={`text-${
                          dress.stock_quantity > 0 ? "success" : "danger"
                        }`}
                      >
                        <i
                          className={`bi bi-${
                            dress.stock_quantity > 0
                              ? "check-circle"
                              : "x-circle"
                          } me-2`}
                        ></i>
                        {dress.stock_quantity > 0
                          ? `In Stock (${dress.stock_quantity} available)`
                          : "Out of Stock"}
                      </small>
                    </div>
                    <div className="card-text">
                      <small className="text-muted">
                        <i className="bi bi-bag-heart me-2"></i>
                        Material: {dress.material}
                      </small>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-top-0">
                    <Link
                      to={`/purchase-dress/${dress.id}`}
                      className="btn btn-primary w-100"
                      disabled={dress.stock_quantity === 0}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      {dress.stock_quantity > 0
                        ? "Purchase Now"
                        : "Out of Stock"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAll;
