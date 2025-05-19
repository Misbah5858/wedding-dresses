import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: "",
    dress_id: "",
    size: "",
    color: "",
    quantity: 1,
    phone: "",
    email: "",
    shipping_address: "",
    special_notes: "",
    payment_method: "",
    subtotal: "",
    discount_amount: "",
    total_amount: "",
    order_status: "",
  });
  const [dress, setDress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/orders/${id}`)
      .then(async (response) => {
        setFormData(response.data);
        try {
          const dressResponse = await axios.get(
            `http://localhost:3000/dresses/${response.data.dress_id}`
          );
          setDress(dressResponse.data);
        } catch (err) {
          console.error("Error fetching dress details:", err);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order:", err);
        setError("Failed to load order data");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setLoading(true);
      axios
        .put(`http://localhost:3000/orders/${id}/cancel`)
        .then(() => {
          alert("Order cancelled successfully!");
          navigate("/");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to cancel order. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .put(`http://localhost:3000/orders/${id}`, formData)
      .then(() => {
        alert("Order updated successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to update order. Please try again.");
      })
      .finally(() => {
        setLoading(false);
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

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  const availableSizes = dress ? JSON.parse(dress.size_available) : [];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="display-4">Update Order</h1>
          <p className="lead">Modify your order details</p>
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
                      <h5 className="dress-price">
                        PKR {formData.total_amount.toLocaleString()}
                      </h5>
                    </div>
                  </div>
                </div>
              )}
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  {formData.order_status !== "cancelled" && (
                    <div className="mb-4">
                      <label htmlFor="order_status" className="form-label">
                        <i className="bi bi-flag me-2"></i>Order Status
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="order_status"
                        name="order_status"
                        value={formData.order_status}
                        onChange={handleChange}
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="customer_name" className="form-label">
                      <i className="bi bi-person me-2"></i>Customer Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      required
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
                        {availableSizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
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
                    ></textarea>
                  </div>

                  <div className="card mb-4">
                    <div className="card-body">
                      <h5>Order Summary</h5>
                      <div className="row">
                        <div className="col-6">
                          <p className="mb-1">
                            <strong>Order Status:</strong>
                          </p>
                          <span
                            className={`badge bg-${
                              formData.order_status === "delivered"
                                ? "success"
                                : formData.order_status === "cancelled"
                                ? "danger"
                                : "primary"
                            }`}
                          >
                            {formData.order_status?.toUpperCase()}
                          </span>
                        </div>
                        <div className="col-6">
                          <p className="mb-1">
                            <strong>Payment Method:</strong>
                          </p>
                          <span className="badge bg-info">
                            {formData.payment_method?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>PKR {formData.subtotal?.toLocaleString()}</span>
                      </div>
                      {formData.discount_amount > 0 && (
                        <div className="d-flex justify-content-between mb-2 text-success">
                          <span>Discount:</span>
                          <span>
                            -PKR {formData.discount_amount?.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>
                          PKR {formData.total_amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Link
                      to="/"
                      className="btn btn-outline-secondary btn-lg px-4"
                    >
                      <i className="bi bi-arrow-left me-2"></i>Back
                    </Link>
                    {formData.order_status !== "cancelled" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-danger btn-lg px-4"
                          onClick={handleCancel}
                        >
                          <i className="bi bi-x-circle me-2"></i>Cancel Order
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg px-4"
                        >
                          <i className="bi bi-check2-circle me-2"></i>Update
                          Order
                        </button>
                      </>
                    )}
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

export default UpdateProduct;
