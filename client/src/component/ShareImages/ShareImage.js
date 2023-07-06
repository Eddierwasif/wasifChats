import React from 'react';
import { BsImage } from "react-icons/bs";
import { GoLocation } from "react-icons/go";
import "../ShareImages/ShareImage.scss";

const ShareImage = ({ showModal, onLocationClick, onImageUpload }) => {
  return (
    showModal && (<div className="modal">
      <label className="modal__icon" htmlFor="image">
        <BsImage />
      </label>
      <input type="file" id="image" name="image" onChange={onImageUpload} accept="image/*" />
      <GoLocation className="modal__icon" onClick={onLocationClick} />
    </div>)
  )
}

export default ShareImage;