import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get("http://localhost:3000/orders")
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
        setLoading(false);
      });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning";
      case "confirmed":
        return "bg-info";
      case "shipped":
        return "bg-primary";
      case "delivered":
        return "bg-success";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="display-4">Orders</h1>
          <p className="lead">View and manage all orders</p>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row mb-4">
          <div className="col">
            <Link to="/" className="btn btn-outline-secondary me-2">
              <i className="bi bi-arrow-left me-2"></i>Back to Shop
            </Link>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="alert alert-info" role="alert">
            <i className="bi bi-info-circle me-2"></i>No orders found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Dress</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>
                      <div>{order.customer_name}</div>
                      <small className="text-muted">{order.phone}</small>
                    </td>
                    <td>
                      <div>{order.dress_name}</div>
                      <small className="text-muted">
                        Size: {order.size} | Qty: {order.quantity}
                      </small>
                    </td>
                    <td>
                      <div>PKR {order.total_amount.toLocaleString()}</div>
                      {order.discount_amount > 0 && (
                        <small className="text-success">
                          Saved: PKR {order.discount_amount.toLocaleString()}
                        </small>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-info">
                        {order.payment_method.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${getStatusBadgeClass(
                          order.order_status
                        )}`}
                      >
                        {order.order_status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/update-order/${order.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-pencil me-1"></i>Update
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
