import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditDress = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
    price: "",
    discount_percentage: 0,
    stock_quantity: 1,
    size_available: [],
    color: "",
    style: "",
    material: "",
    features: "",
  });

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:3000/dresses/${id}`),
      axios.get("http://localhost:3000/categories"),
    ])
      .then(([dressRes, categoriesRes]) => {
        const dress = dressRes.data;
        setFormData({
          ...dress,
          size_available: JSON.parse(dress.size_available),
        });
        setCategories(categoriesRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load dress data");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "size_available") {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
      setFormData({
        ...formData,
        [name]: selectedOptions,
      });
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

    const dataToSubmit = {
      ...formData,
      size_available: JSON.stringify(formData.size_available),
    };

    axios
      .put(`http://localhost:3000/dresses/${id}`, dataToSubmit)
      .then(() => {
        alert("Dress updated successfully!");
        navigate("/manage-dresses");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to update dress. Please try again.");
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
          <h1 className="display-4">Edit Dress</h1>
          <p className="lead">Update dress details in your inventory</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label">
                      <i className="bi bi-tag me-2"></i>Dress Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="category_id" className="form-label">
                        <i className="bi bi-folder me-2"></i>Category
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="price" className="form-label">
                        <i className="bi bi-currency-dollar me-2"></i>Price
                        (PKR)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label
                        htmlFor="discount_percentage"
                        className="form-label"
                      >
                        <i className="bi bi-percent me-2"></i>Discount
                        Percentage
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        id="discount_percentage"
                        name="discount_percentage"
                        value={formData.discount_percentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="stock_quantity" className="form-label">
                        <i className="bi bi-boxes me-2"></i>Stock Quantity
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        id="stock_quantity"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleChange}
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="size_available" className="form-label">
                      <i className="bi bi-rulers me-2"></i>Available Sizes
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="size_available"
                      name="size_available"
                      value={formData.size_available}
                      onChange={handleChange}
                      required
                      multiple
                    >
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                    <small className="text-muted">
                      Hold Ctrl/Cmd to select multiple sizes
                    </small>
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
                      <label htmlFor="style" className="form-label">
                        <i className="bi bi-stars me-2"></i>Style
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="style"
                        name="style"
                        value={formData.style}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="material" className="form-label">
                      <i className="bi bi-box-seam me-2"></i>Material
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="description" className="form-label">
                      <i className="bi bi-text-paragraph me-2"></i>Description
                    </label>
                    <textarea
                      className="form-control form-control-lg"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="features" className="form-label">
                      <i className="bi bi-list-stars me-2"></i>Features
                    </label>
                    <textarea
                      className="form-control form-control-lg"
                      id="features"
                      name="features"
                      value={formData.features}
                      onChange={handleChange}
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Link
                      to="/manage-dresses"
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
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2-circle me-2"></i>
                          Update Dress
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

export default EditDress;
