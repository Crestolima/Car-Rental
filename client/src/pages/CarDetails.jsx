import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/api";

const CarDetails = () => {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [carData, setCarData] = useState({
    make: "",
    model: "",
    year: "",
    type: "",
    transmission: "",
    pricePerDay: "",
    available: true,
    images: [],
    features: [],
    location: {
      city: "",
      address: "",
      coordinates: {
        latitude: "",
        longitude: ""
      }
    }
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [feature, setFeature] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await api.get("/cars");
      setCars(response.data);
    } catch (error) {
      toast.error("Error fetching cars");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData((prev) => {
      const keys = name.split(".");
      if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleCoordinatesChange = (e) => {
    const { name, value } = e.target;
    setCarData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          ...prev.location.coordinates,
          [name]: value
        }
      }
    }));
  };

  const handleFeatureAdd = () => {
    if (feature.trim()) {
      setCarData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
      setFeature("");
    }
  };

  const handleFeatureRemove = (indexToRemove) => {
    setCarData(prev => ({
      ...prev,
      features: prev.features.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setCarData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleImageRemove = (indexToRemove) => {
    setCarData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (!carData.location.city || !carData.location.address) {
      toast.error("City and Address are required.");
      return;
    }
  
    try {
      const formData = new FormData();
      Object.keys(carData).forEach((key) => {
        if (key !== "images" && key !== "features") {
          formData.append(key, typeof carData[key] === "object" ? JSON.stringify(carData[key]) : carData[key]);
        }
      });
  
      formData.append("features", JSON.stringify(carData.features));
      carData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });
  
      if (editMode) {
        await api.put(`/cars/${selectedCarId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Car updated successfully");
      } else {
        await api.post("/cars", formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Car added successfully");
      }
      
      handleClose();
      fetchCars();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving car");
    }
  };

  const handleEdit = (car) => {
    setCarData(car);
    setSelectedCarId(car._id);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await api.delete(`/cars/${id}`);
        toast.success("Car deleted successfully");
        fetchCars();
      } catch (error) {
        toast.error("Error deleting car");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCarData({
      make: "",
      model: "",
      year: "",
      type: "",
      transmission: "",
      pricePerDay: "",
      available: true,
      images: [],
      features: [],
      location: {
        city: "",
        address: "",
        coordinates: {
          latitude: "",
          longitude: ""
        }
      }
    });
  };

  return (
    <div className="w-full p-4 md:p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Car Management</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={() => setOpen(true)}
        >
          Add Car
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-sm rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Day</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cars.map((car) => (
                  <tr key={car._id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm">{car.make}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm">{car.model}</td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm">{car.year}</td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm">{car.type}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm">${car.pricePerDay}/day</td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm">
                      {car.available ? "Available" : "Not Available"}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm">{car.location.city}</td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        onClick={() => handleEdit(car)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 transition-colors"
                        onClick={() => handleDelete(car._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? "Edit Car" : "Add Car"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Make</label>
                <input
                  type="text"
                  name="make"
                  value={carData.make}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  name="model"
                  value={carData.model}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  name="year"
                  value={carData.year}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input
                  type="text"
                  name="type"
                  value={carData.type}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Transmission</label>
                <select
                  name="transmission"
                  value={carData.transmission}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price per Day</label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={carData.pricePerDay}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="location.city"
                  value={carData.location.city}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="location.address"
                  value={carData.location.address}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={carData.location.coordinates.latitude}
                  onChange={handleCoordinatesChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={carData.location.coordinates.longitude}
                  onChange={handleCoordinatesChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Features</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add a feature"
                    />
                    <button
                      onClick={handleFeatureAdd}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {carData.features.map((feat, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center"
                      >
                        {feat}
                        <button
                          onClick={() => handleFeatureRemove(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
  
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {carData.images.map((image, index) => (
                      <div key={index} className="relative group aspect-w-16 aspect-h-9">
                        <div className="rounded-lg overflow-hidden bg-gray-100 h-full">
                          {image instanceof File ? (
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <img
                              src={image}
                              alt={`Car image ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          )}
                          <button
                            onClick={() => handleImageRemove(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
  
                <div className="col-span-1 md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={carData.available}
                      onChange={(e) => setCarData(prev => ({ ...prev, available: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Available for Rent
                    </span>
                  </label>
                </div>
  
                <div className="col-span-1 md:col-span-2 mt-6 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={handleClose}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editMode ? "Update Car" : "Add Car"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default CarDetails;