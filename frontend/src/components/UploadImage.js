import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

import { uploadProfileImage } from '../actions/user-action';
import { useHttpClient } from "../hooks/http-hook";
import M from "materialize-css";
import './stylesheets/UploadImage.css';

const UploadImage = ({ uploadProfileImage, profileImageUrl }) => {
    const history = useHistory();
    const { sendRequest } = useHttpClient();
    const [ fileInputState, setFileInputState ] = useState('');//Image url temporary(for input tag)
    const [ previewSource, setPreviewSource ] = useState('');//converted normal image to base64EncodedImage format
    const [ selectedFile, setSelectedFile ] = useState();//for check is any file selected or not before submitting
    const [ loading, setLoading ] = useState(false);

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]; //File data with file
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
        reader.onerror = () => {
            M.toast({html: 'Image upload failed, Please try again', classes: 'red'});
        };
    };

    const handleSubmitFile = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        await uploadImage(previewSource)
    };

    const uploadImage = async (base64EncodedImage) => {
        setLoading(true);
        await uploadProfileImage(base64EncodedImage, sendRequest);
        setLoading(false);
        await history.push('/profile/');
    };

    return (
        <div className="uploadImage">
            {/* Profile Image */}
            {!previewSource && (
                <img
                    className="previewImage"
                    src={profileImageUrl}
                    alt="Add Profile Image"
                />
            )}

            {/* ProfileScreen Image */}
            {previewSource && (
                <img
                    className="previewImage"
                    src={previewSource}
                    alt="chosen"
                />
            )}

            <form onSubmit={handleSubmitFile} className="form">
                <div className="image-selection">
                    <label htmlFor="fileInput">Change Profile Picture</label>
                    <input
                        id="fileInput"
                        type="file"
                        name="image"
                        onChange={handleFileInputChange}
                        value={fileInputState}
                        className="form-input"
                    />
                </div>
                <button className="btn" type="submit">
                    {loading && <i className="fas fa-spinner fa-pulse" />}
                    {loading && ' Uploading Image'}
                    {!loading && 'Upload ProfileScreen Image'}
                </button>
            </form>
        </div>
    );
};

export default connect(null, { uploadProfileImage } )(UploadImage);
