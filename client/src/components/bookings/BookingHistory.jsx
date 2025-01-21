const BookingHistory = ({ bookings }) => {
    const getStatusColor = (status) => {
      const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        cancelled: 'bg-red-100 text-red-800'
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
    };
  
    return (
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {booking.carId.make} {booking.carId.model}
                </h3>
                <p className="text-gray-600">
                  {new Date(booking.startDate).toLocaleDateString()} - 
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>
            <div className="mt-4">
              <p>Pickup: {booking.pickupLocation}</p>
              <p>Dropoff: {booking.dropoffLocation}</p>
              <p className="font-semibold mt-2">Total: ${booking.totalPrice}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default BookingHistory;