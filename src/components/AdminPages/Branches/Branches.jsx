// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "../../../App.css";
import "font-awesome/css/font-awesome.min.css";
import view_icon from "../../../assets/images/view_icon.png";
import edit_icon from "../../../assets/images/edit_icon.png";
import delete_icon from "../../../assets/images/delete_icon.png";
import check from "../../../assets/images/check.png";

import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import axiosInstance from "../../../../axiosInstance";
import {useLoader} from "../../Loaders/LoaderContext";


function Branches() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const {setLoading} = useLoader();


  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/branches");
        const formattedData = response.data.map((branch) => ({
          id: branch.id,
          branch_name: branch.branch_name,
          address: formatAddress(branch.branch_address), 
          operating_hours: branch.operating_hours,
          status: getBranchStatus(branch),
        }));
        setData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally{
        setLoading(false);
      }
    };
  
 
    const formatAddress = (address) => {
      return address
        .split(",") // Split the address into parts based on commas
        .map(part => part.trim()) // Remove extra spaces from each part
        .filter(part => part.length > 0) // Filter out empty parts
        .join(", "); // Join the remaining parts back together with a comma
    };
  
    fetchBranches();
  }, [navigate]);
  

  //filter branches
  useEffect(() => {
    const results = data.filter(
      (branch) =>
        (selectedBranchId ? branch.id === parseInt(selectedBranchId) : true) &&
        (branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredData(results);
  }, [searchTerm, data, selectedBranchId]);

  const handleBranchSelect = (e) => {
    setSelectedBranchId(e.target.value);
    console.log("Selected Branch ID:", e.target.value);
  };

  const getBranchStatus = (branch) => {
    if (!branch.operating_hours || typeof branch.operating_hours !== "object") {
      // Handle cases where operating_hours might be undefined or not an object
      return "Unknown"; // or 'Closed' as a fallback
    }

    const currentTime = new Date();
    let currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    const openTime = branch.operating_hours.open.split(":");
    const closeTime = branch.operating_hours.close.split(":");

    const openMinutes =
      parseInt(openTime[0], 10) * 60 + parseInt(openTime[1], 10);
    let closeMinutes =
      parseInt(closeTime[0], 10) * 60 + parseInt(closeTime[1], 10);

    // Adjust closeMinutes for overnight periods
    if (closeMinutes < openMinutes) {
      closeMinutes += 24 * 60; // Add 24 hours worth of minutes
    }

    // Adjust currentMinutes for overnight periods
    if (currentMinutes < openMinutes) {
      currentMinutes += 24 * 60; // Add 24 hours worth of minutes
    }

    // Determine if the current time falls within the open hours
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
      ? "Open"
      : "Closed";
  };

  //modal view
  const handleViewClick = (branch) => {
    setSelectedBranches(branch);
    setShowModal(true);
  };
  //close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleEditBranchClick = (branchId) => {
    navigate(`/edit-branch/${branchId}`);
  };

  //handle deleting of branch
  const handleDeleteBranchClick = async (branchId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      showCancelButton: true,
      icon: "warning",
      confirmButtonColor: "#EC221F",
      cancelButtonColor: "#00000000",
      cancelTextColor: "#000000",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        container: "custom-container",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
        title: "custom-swal-title",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/delete-branch/${branchId}`);
          setData(data.filter((branch) => branch.id !== branchId));
          Swal.fire({
            title: "Success!",
            text: "Branch has been deleted.",
            imageUrl: check,
            imageWidth: 100,
            imageHeight: 100,
            confirmButtonText: "OK",
            confirmButtonColor: "#0ABAA6",
            customClass: {
              confirmButton: "custom-success-confirm-button",
              title: "custom-swal-title",
            },
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the branch.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#EC221F",
            customClass: {
              confirmButton: "custom-error-confirm-button",
              title: "custom-swal-title",
            },
          });
        }
      }
    });
  };

  //table columns
  const columns = [
    {
      name: "Branch",
      selector: (row) => row.branch_name,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "Operating Hours",
      selector: (row) => {
        if (typeof row.operating_hours === "object") {
          return `${row.operating_hours.open} - ${row.operating_hours.close}`;
        }
        return row.operating_hours;
      },
      sortable: false,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          style={{
            color: row.status === "Open" ? "green" : "red",
          }}
        >
          {row.status}
        </span>
      ),
      sortable: false,
    },

    {
      name: "Action",
      selector: (row) => (
        <div>
          <img
            src={view_icon}
            title="View Branch Details"
            alt="view"
            width="25"
            height="25"
            onClick={() => handleViewClick(row)}
            style={{ cursor: "pointer" }}
          />
          <img
            className="ml-3"
            src={edit_icon}
            title="Edit Branch Details"
            onClick={() => handleEditBranchClick(row.id)}
            style={{ cursor: "pointer" }}
            alt="edit"
            width="25"
            height="25"
          />

          <img
            className="ml-3"
            src={delete_icon}
            title="Delete Branch"
            style={{ cursor: "pointer" }}
            onClick={() => handleDeleteBranchClick(row.id)}
            alt="delete"
            width="25"
            height="25"
          />
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-6">
          <h3>Branches</h3>
          <div className="top-filter">
            <select
              name="filter"
              id="filter"
              onChange={handleBranchSelect}
              value={selectedBranchId}
            >
              <option value="">All Branches</option>
              {data.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch_name}
                </option>
              ))}
            </select>
            <input
              id="search-bar"
              type="text"
              placeholder="Search Branch or Address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => navigate("/add-branch")}
              className="btn btn-primary float-end add-user-btn"
            >
              <i className="fa fa-plus"></i> Add New Branch
            </button>
          </div>
          <div className="container-content">
            <DataTable
              className="dataTables_wrapper"
              columns={columns}
              data={filteredData}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20]}
            />
          </div>
        </div>
      </div>

      {selectedBranches && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Branch Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="branch-container">
              <h2>{selectedBranches.branch_name}</h2>
              <h5>Full Address:</h5>
              <p>{selectedBranches.address}</p>
              <h5>Operating Hours</h5>
              <p>
                Open: {selectedBranches.operating_hours?.open} - Close:{" "}
                {selectedBranches.operating_hours?.close}
              </p>
              <h5>Status</h5>
              <p>{selectedBranches.status}</p>
            </div>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer> */}
        </Modal>
      )}
    </div>
  );
}

export default Branches;
