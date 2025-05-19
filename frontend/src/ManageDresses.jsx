import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ManageDresses = () => {
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDresses = () => {
    axios
      .get("http://localhost:3000/dresses")
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

  useEffect(() => {
    fetchDresses();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this dress?")) {
      axios
        .delete(`http://localhost:3000/dresses/${id}`)
        .then(() => {
          alert("Dress deleted successfully!");
          fetchDresses(); // Refresh the list
        })
        .catch((error) => {
          console.error("Error deleting dress:", error);
          alert("Failed to delete dress. It might be referenced in orders.");
        });
    }
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
          <h1 className="display-4">Manage Dresses</h1>
          <p className="lead">
            Add, edit, or remove dresses from your inventory
          </p>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row mb-4">
          <div className="col">
            <Link to="/" className="btn btn-outline-secondary me-2">
              <i className="bi bi-arrow-left me-2"></i>Back to Shop
            </Link>
            <Link to="/add-dress" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>Add New Dress
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dresses.map((dress) => (
                <tr key={dress.id}>
                  <td>{dress.name}</td>
                  <td>{dress.category_name}</td>
                  <td>PKR {dress.price.toLocaleString()}</td>
                  <td>
                    {dress.discount_percentage > 0 ? (
                      <span className="badge bg-danger">
                        {dress.discount_percentage}% OFF
                      </span>
                    ) : (
                      <span className="badge bg-secondary">No Discount</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge bg-${
                        dress.stock_quantity > 0 ? "success" : "danger"
                      }`}
                    >
                      {dress.stock_quantity} in stock
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/edit-dress/${dress.id}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      <i className="bi bi-pencil me-1"></i>Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(dress.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageDresses;
