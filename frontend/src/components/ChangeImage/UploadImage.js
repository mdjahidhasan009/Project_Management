import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

import { uploadProfileImage } from '../../actions/user-action';
import { useHttpClient } from "../../hooks/http-hook";
import M from "materialize-css";
import './UploadImage.css';

const UploadImage = ({ uploadProfileImage, isAuthenticated }) => {
    const history = useHistory();
    const { sendRequest } = useHttpClient();
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value); //Temp
        console.log(e.target.files[0])
        console.log(e.target.value)
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
        await uploadProfileImage(base64EncodedImage, sendRequest);
        await history.push('/profile/');
    };

    return (
        <div className="main uploadImage">
            {isAuthenticated && (
                <div className="uploadImage__div">
                    <h4 className="title">Upload an Image</h4>
                    <form onSubmit={handleSubmitFile} className="form">
                        <input
                            id="fileInput"
                            type="file"
                            name="image"
                            onChange={handleFileInputChange}
                            value={fileInputState}
                            className="form-input"
                        />
                        <button className="btn" type="submit">
                            Submit
                        </button>
                    </form>

                    {previewSource && (
                        <img
                            className="previewImage"
                            src={previewSource}
                            alt="chosen"
                            style={{ height: '300px' }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { uploadProfileImage } )(UploadImage);
