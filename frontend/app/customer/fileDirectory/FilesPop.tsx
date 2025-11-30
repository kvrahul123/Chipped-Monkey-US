import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { getLocalStorageItem } from "@/app/common/LocalStorage";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

type ImgOption = {
  id: number;
  file_original_name: string;
  file_size: string;
  file_name: string;
};

const ModalComponent: React.FC<{
  showModal: boolean;
  handleClose: () => void;
  onSelectImages: (images: number[]) => void;
  type: string | null;
  preSelectedImages: number[] | number | string; // Handle multiple input types
}> = ({ showModal, handleClose, onSelectImages, type, preSelectedImages }) => {
  const [imgFiles, setImgFiles] = useState<ImgOption[]>([]);
  const [activeTab, setActiveTab] = useState("tab1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  const token = getLocalStorageItem("token");
  // Normalize preSelectedImages to always be an array
  const normalizePreSelectedImages = (
    images: number[] | number | string
  ): number[] => {
    if (Array.isArray(images)) {
      return images.map(Number); // Ensure all elements are numbers
    }

    if (typeof images === "string") {
      // Handle comma-separated string values
      return images
        .split(",") // Split the string by commas
        .map((value) => Number(value.trim())) // Convert each value to a number
        .filter((value) => !isNaN(value)); // Remove NaN values
    }

    // If it's a single number, wrap it in an array
    return [Number(images)].filter((value) => !isNaN(value)); // Remove NaN just in case
  };

  // Debug selectedImageIds
  useEffect(() => {
    console.log("Selected IDs:", selectedImageIds);
  }, [selectedImageIds]);

  // Fetch files only on component mount
  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await axios.get(`${appUrl}filemanager/photos`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        if (data && data.statusCode === 200) {
          setImgFiles(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    getFiles();
  }, []);

  const [file, setFile] = useState<File | null>(null); // Track selected file

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post(
          `${appUrl}filemanager/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("File upload response:", response.data);

        // Extract uploaded file information
        const uploadedFile = response.data.data[0]; // Get the first uploaded file from the response

        // Add the uploaded image to the state
        setImgFiles((prevFiles) => [
          {
            id: uploadedFile.id,
            fileOriginalName: uploadedFile.fileOriginalName,
            fileName: `${uploadedFile.fileName}`,
          },
          ...prevFiles, // Add new files at the beginning
        ]);

        // Switch to Tab 1 after successful upload
        setActiveTab("tab1");
      } catch (error) {
        console.error("Failed to upload file", error);
      }
    }
  };

  // Reset selection when type or preSelectedImages change
  useEffect(() => {
    const normalizedImages = normalizePreSelectedImages(preSelectedImages);
    console.log(
      "Resetting selectedImageIds with preSelectedImages:",
      normalizedImages
    );
    setSelectedImageIds(normalizedImages);
  }, [type, preSelectedImages]);

  const handleImageClick = (id: number) => {
    setSelectedImageIds((prevSelectedIds) => {
      const updatedSet = new Set(prevSelectedIds);
      if (updatedSet.has(id)) {
        updatedSet.delete(id);
      } else {
        updatedSet.add(id);
      }
      const updatedArray = Array.from(updatedSet);
      console.log("Updated IDs after toggle:", updatedArray);
      return updatedArray;
    });
  };

  const filteredFiles = imgFiles
    .filter((item) => {
      // Ensure file_original_name exists and filter based on search query
      return (
        !searchQuery ||
        item.fileOriginalName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      const isSelectedA = selectedImageIds.includes(a.id) ? -1 : 1;
      const isSelectedB = selectedImageIds.includes(b.id) ? -1 : 1;
      return isSelectedA - isSelectedB;
    });

  const handleConfirmSelection = () => {
    console.log("Confirming selected IDs:", selectedImageIds);
    onSelectImages(selectedImageIds);
    handleClose();
  };

  const handleClearSelection = () => {
    console.log("Clearing all selected IDs");
    setSelectedImageIds([]);
  };

  if (!showModal) return null;

  return (
    <div
      className="modal fade show d-block"
      id="exampleModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <ul className="nav nav-pills nav-fill">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "tab1" ? "active" : ""}`}
                  onClick={() => setActiveTab("tab1")}>
                  Select File
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "tab2" ? "active" : ""}`}
                  onClick={() => setActiveTab("tab2")}>
                  Upload New
                </button>
              </li>
            </ul>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="tab-content mt-3">
              {activeTab === "tab1" && (
                <div className="tab-pane fade show active">
                  <div className="d-flex justify-content-end mb-3">
                    <input
                      type="text"
                      className="form-control form-control-sm w-25"
                      placeholder="Search your files"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="row">
                    {filteredFiles.map((item) => (
                      <div className="col-md-3 mb-3" key={item.id}>
                        <div
                          className={`img-directory ${
                            selectedImageIds.includes(item.id) ? "active" : ""
                          }`}
                          onClick={() => handleImageClick(item.id)}>
                          <Image
                            src={`${appUrl}uploads/${item.fileName}`}
                            width={100}
                            height={100}
                            className="img-fluid"
                            alt={item.fileOriginalName}
                          />
                          <h6 className="mt-2 text-truncate">
                            {item.fileOriginalName}
                          </h6>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "tab2" && (
                <>
                  <label className="form__container" id="upload-container">
                    Choose or Drag & Drop Files
                    <input
                      className="form__file"
                      id="import_file"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              onClick={handleConfirmSelection}>
              Add files
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={handleClearSelection}>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
