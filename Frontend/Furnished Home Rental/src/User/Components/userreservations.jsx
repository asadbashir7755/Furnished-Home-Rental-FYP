import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { Tooltip, Modal, message } from 'antd';
import { fetchUserReservations, cancelUserReservation } from './API/userreservations';

// Helper to extract ISO date from MongoDB extended JSON
const getMongoDate = (dateObj) => {
  if (!dateObj) return '';
  if (typeof dateObj === 'string' || typeof dateObj === 'number') {
    return new Date(dateObj).toLocaleString();
  }
  if (dateObj.$date && dateObj.$date.$numberLong) {
    return new Date(Number(dateObj.$date.$numberLong)).toLocaleString();
  }
  if (dateObj.$date) {
    return new Date(dateObj.$date).toLocaleString();
  }
  return '';
};

const statusBadge = (status) => {
  let color = "secondary";
  let label = "N/A";
  if (status === 'confirmed' || status === 'booked') {
    color = "success";
    label = "Booked";
  } else if (status === 'pending') {
    color = "warning text-dark";
    label = "Pending";
  } else if (status === 'cancelled') { // use 'cancelled' everywhere
    color = "danger";
    label = "Cancelled";
  } else if (status === 'completed') {
    color = "primary";
    label = "Completed";
  } else if (status) {
    label = status.charAt(0).toUpperCase() + status.slice(1);
  }
  return (
    <span className={`badge bg-${color}`} style={{ fontSize: 13 }}>
      {label}
    </span>
  );
};

const TABS = [
  { key: "all", label: "All" },
  { key: "booked", label: "Booked" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" } // use 'cancelled'
];

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const fetchReservations = () => {
    setLoading(true);
    fetchUserReservations()
      .then(data => {
        const resArr = Array.isArray(data)
          ? data
          : (Array.isArray(data?.reservations) ? data.reservations : []);
        setReservations(resArr);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load reservations.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleViewProperty = (propertyId) => {
    if (propertyId) {
      navigate(`/propertywithid/${propertyId}`);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    setCancelLoading(true);
    try {
      await cancelUserReservation(reservationId);
      message.success('Reservation cancelled successfully!');
      setCancelId(null);
      fetchReservations();
    } catch (err) {
      message.error('Failed to cancel reservation.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Filter reservations by tab
  const filteredReservations = reservations.filter(res => {
    if (activeTab === "all") return true;
    if (activeTab === "booked") return res.status === "booked";
    if (activeTab === "completed") return res.status === "completed";
    if (activeTab === "cancelled") return res.status === "cancelled"; // use 'cancelled'
    return true;
  });

  // Add this function to render placeholder reservation cards
  const renderPlaceholderReservations = () => {
    return Array(4).fill(0).map((_, index) => (
      <div key={`placeholder-${index}`} className="reservation-card placeholder-card">
        <div className="reservation-header">
          <div className="placeholder-image" style={{ width: 120, height: 120 }}></div>
          <div className="reservation-details">
            <div className="placeholder-title"></div>
            <div className="placeholder-dates"></div>
            <div className="placeholder-guests"></div>
          </div>
        </div>
        <div className="reservation-footer">
          <div className="placeholder-price"></div>
          <div className="placeholder-status"></div>
        </div>
      </div>
    ));
  };

  if (loading) return (
    <div className="user-reservations-container">
      <h2>Your Reservations</h2>
      <div className="reservations-grid">
        {renderPlaceholderReservations()}
      </div>
    </div>
  );
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!reservations.length) return <div className="alert alert-info mt-4">No reservations found.</div>;

  return (
    <div className="container my-5">
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <div className="card shadow-lg border-0" style={{ borderRadius: 18, background: "#fff" }}>
          <div
            className="card-header d-flex align-items-center"
            style={{
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              background: "#343a40",
              color: "#fff"
            }}
          >
            <FaClipboardList className="me-2" size={22} />
            <h2 className="mb-0" style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>Your Reservations</h2>
          </div>
          {/* Tabs */}
          <div className="px-4 pt-3 pb-0 bg-white">
            <ul className="nav nav-tabs" style={{ borderBottom: "2px solid #dee2e6" }}>
              {TABS.map(tab => (
                <li className="nav-item" key={tab.key}>
                  <button
                    className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                    style={{
                      border: "none",
                      borderBottom: activeTab === tab.key ? "3px solid #343a40" : "3px solid transparent",
                      color: activeTab === tab.key ? "#343a40" : "#6c757d",
                      background: "none",
                      fontWeight: 500,
                      fontSize: 16,
                      padding: "10px 24px",
                      cursor: "pointer"
                    }}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0" style={{ minWidth: 1100 }}>
                <thead className="table-light">
                  <tr>
                    <th className="fw-bold">#</th>
                    <th className="fw-bold">Reservation ID</th>
                    <th className="fw-bold">Property ID</th>
                    <th className="fw-bold">Start Date</th>
                    <th className="fw-bold">End Date</th>
                    <th className="fw-bold">Guests</th>
                    <th className="fw-bold">Status</th>
                    <th className="fw-bold">Payment ID</th>
                    <th className="fw-bold">User Name</th>
                    <th className="fw-bold">User Email</th>
                    <th className="fw-bold">Created At</th>
                    <th className="fw-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="text-center py-4 text-muted">
                        No reservations found for this status.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((res, idx) => {
                      const propertyId = res.propertyId?.$oid || res.propertyId || '';
                      const isBooked = res.status === 'booked';
                      // Only show cancel for 'booked', not for 'completed' or 'cancelled'
                      return (
                        <tr key={res._id?.$oid || res._id} className={idx % 2 === 0 ? "bg-white" : "bg-light"}>
                          <td>{idx + 1}</td>
                          <td>
                            <Tooltip title={res._id?.$oid || res._id}>
                              <span style={{ fontFamily: "monospace" }}>{(res._id?.$oid || res._id)?.slice(0, 8)}...</span>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title={propertyId}>
                              <span style={{ fontFamily: "monospace" }}>{propertyId?.slice(0, 8)}...</span>
                            </Tooltip>
                          </td>
                          <td>{getMongoDate(res.dates?.startDate)}</td>
                          <td>{getMongoDate(res.dates?.endDate)}</td>
                          <td>{res.guests?.$numberInt || res.guests || 'N/A'}</td>
                          <td>{statusBadge(res.status)}</td>
                          <td>
                            <Tooltip title={res.paymentIntentId || 'N/A'}>
                              <span style={{ fontFamily: "monospace" }}>{(res.paymentIntentId || 'N/A')?.slice(0, 8)}...</span>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title={res.user?.name || 'N/A'}>
                              <span>{res.user?.name || 'N/A'}</span>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title={res.user?.email || 'N/A'}>
                              <span>{res.user?.email || 'N/A'}</span>
                            </Tooltip>
                          </td>
                          <td>{getMongoDate(res.createdAt)}</td>
                          <td className="text-center">
                            <div className="d-flex flex-column gap-2">
                              {propertyId && (
                                <Tooltip title="View property details">
                                  <button
                                    className="btn btn-outline-primary btn-sm"
                                    style={{
                                      minWidth: 110,
                                      fontWeight: 500
                                    }}
                                    onClick={() => handleViewProperty(propertyId)}
                                  >
                                    <FaInfoCircle className="me-1" /> View Details
                                  </button>
                                </Tooltip>
                              )}
                              {/* Show Cancel only if status is 'booked' */}
                              {isBooked && (
                                <Tooltip title="Cancel this reservation">
                                  <button
                                    className="btn btn-outline-secondary btn-sm"
                                    style={{
                                      minWidth: 110,
                                      fontWeight: 500
                                    }}
                                    onClick={() => setCancelId(res._id?.$oid || res._id)}
                                  >
                                    <FaTimesCircle className="me-1" /> Cancel
                                  </button>
                                </Tooltip>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Cancel Confirmation Modal */}
      <Modal
        open={!!cancelId}
        title="Cancel Reservation"
        okText="Yes, Cancel"
        okButtonProps={{ danger: true, loading: cancelLoading }}
        cancelText="No"
        onOk={() => handleCancelReservation(cancelId)}
        onCancel={() => setCancelId(null)}
        centered
      >
        <p style={{ fontWeight: 500, color: "#dc3545" }}>
          Are you sure you want to cancel this reservation? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default UserReservations;

