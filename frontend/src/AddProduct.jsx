import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const { dressId } = useParams();
  const [dress, setDress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const initialState = {
    customer_name: "",
    dress_id: dressId,
    size: "",
    quantity: 1,
    color: "",
    phone: "",
    email: "",
    shipping_address: "",
    special_notes: "",
    payment_method: "card",
    subtotal: "",
    discount_amount: "",
    total_amount: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (dressId) {
      axios
        .get(`http://localhost:3000/dresses/${dressId}`)
        .then((response) => {
          setDress(response.data);
          const discountAmount =
            response.data.price * (response.data.discount_percentage / 100);
          setFormData((prev) => ({
            ...prev,
            color: response.data.color,
            subtotal: response.data.price,
            discount_amount: discountAmount,
            total_amount: response.data.discounted_price,
          }));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching dress details:", error);
          setLoading(false);
        });
    }
  }, [dressId]);

  const handleQuantityChange = (value) => {
    const quantity = Math.max(1, Math.min(value, dress.stock_quantity));
    const subtotal = dress.price * quantity;
    const discountAmount = subtotal * (dress.discount_percentage / 100);
    const total = subtotal - discountAmount;

    setFormData({
      ...formData,
      quantity,
      subtotal,
      discount_amount: discountAmount,
      total_amount: total,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      handleQuantityChange(parseInt(value) || 1);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    axios
      .post("http://localhost:3000/orders", formData)
      .then((response) => {
        console.log("Success:", response.data);
        alert("Order placed successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response?.data?.error === "Insufficient stock") {
          alert(
            `Sorry, only ${error.response.data.available} items are available.`
          );
        } else {
          alert("Failed to place order. Please try again.");
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const availableSizes = dress ? JSON.parse(dress.size_available) : [];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="display-4">Purchase Your Dream Dress</h1>
          <p className="lead">Complete your purchase for {dress?.name}</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0">
              {dress && (
                <div className="card-header bg-light p-4">
                  <div className="row">
                    <div className="col-md-8">
                      <h4>{dress.name}</h4>
                      <p className="text-muted mb-0">{dress.description}</p>
                    </div>
                    <div className="col-md-4 text-end">
                      {dress.discount_percentage > 0 ? (
                        <>
                          <p className="mb-0">
                            <span className="text-decoration-line-through text-muted">
                              PKR {dress.price.toLocaleString()}
                            </span>
                            <span className="badge bg-danger ms-2">
                              -{dress.discount_percentage}%
                            </span>
                          </p>
                          <h5 className="dress-price">
                            PKR {dress.discounted_price.toLocaleString()}
                          </h5>
                        </>
                      ) : (
                        <h5 className="dress-price">
                          PKR {dress.price.toLocaleString()}
                        </h5>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="customer_name" className="form-label">
                      <i className="bi bi-person me-2"></i>Your Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="size" className="form-label">
                        <i className="bi bi-rulers me-2"></i>Dress Size
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Size</option>
                        {availableSizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="quantity" className="form-label">
                        <i className="bi bi-123 me-2"></i>Quantity
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        max={dress.stock_quantity}
                        required
                      />
                      <small className="text-muted">
                        {dress.stock_quantity} available
                      </small>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="color" className="form-label">
                        <i className="bi bi-palette me-2"></i>Color
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="payment_method" className="form-label">
                        <i className="bi bi-credit-card me-2"></i>Payment Method
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="payment_method"
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleChange}
                        required
                      >
                        <option value="card">Credit/Debit Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cash">Cash on Delivery</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">
                        <i className="bi bi-telephone me-2"></i>Contact Number
                      </label>
                      <input
                        type="tel"
                        className="form-control form-control-lg"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        <i className="bi bi-envelope me-2"></i>Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="shipping_address" className="form-label">
                      <i className="bi bi-geo-alt me-2"></i>Shipping Address
                    </label>
                    <textarea
                      className="form-control form-control-lg"
                      id="shipping_address"
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleChange}
                      required
                      rows="2"
                      placeholder="Enter complete shipping address"
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="special_notes" className="form-label">
                      <i className="bi bi-pencil me-2"></i>Special Notes
                    </label>
                    <textarea
                      className="form-control form-control-lg"
                      id="special_notes"
                      name="special_notes"
                      value={formData.special_notes}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Any special notes or requirements?"
                    ></textarea>
                  </div>

                  <div className="card mb-4">
                    <div className="card-body">
                      <h5>Order Summary</h5>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>PKR {formData.subtotal.toLocaleString()}</span>
                      </div>
                      {formData.discount_amount > 0 && (
                        <div className="d-flex justify-content-between mb-2 text-success">
                          <span>Discount:</span>
                          <span>
                            -PKR {formData.discount_amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>
                          PKR {formData.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Link
                      to="/"
                      className="btn btn-outline-secondary btn-lg px-4 me-2"
                    >
                      <i className="bi bi-arrow-left me-2"></i>Back
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-5"
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cart-check me-2"></i>
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
