import React, { useState } from 'react';
import { connect } from 'react-redux';

import { uploadProfileImage } from '../../actions/user-action';

import './UploadImage.css';
import {useHttpClient} from "../../hooks/http-hook";

const UploadImage = ({ uploadProfileImage }) => {
    const { isLoading, error, sendRequest , clearError} = useHttpClient();
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    // const [successMsg, setSuccessMsg] = useState('');
    // const [errMsg, setErrMsg] = useState('');
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
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
    };

    const handleSubmitFile = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
            await uploadImage(reader.result);
        };
        reader.onerror = () => {
            console.error('AHHHHHHHH!!');
            // setErrMsg('something went wrong!');
        };
    };

    const uploadImage = async (base64EncodedImage) => {
        await uploadProfileImage(base64EncodedImage, sendRequest);
        // try {
        //     await fetch(process.env.REACT_APP_ASSET_URL + '/api/upload', {
        //         method: 'POST',
        //         body: JSON.stringify({ data: base64EncodedImage }),
        //         headers: { 'Content-Type': 'application/json',
        //             'Authorization': 'Bearer ' + localStorage.token
        //         },
        //     });
        //     setFileInputState('');
        //     setPreviewSource('');
        //     // setSuccessMsg('Image uploaded successfully');
        // } catch (err) {
        //     console.error(err);
        //     // setErrMsg('Something went wrong!');
        // }
    };
    return (
        <div className="main">
            <div className="uploadImage">
                <h4 className="title">Upload an Image</h4>
                {/*<Alert msg={errMsg} type="danger" />*/}
                {/*<Alert msg={successMsg} type="success" />*/}
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
        </div>
    );
}

export default connect(null, { uploadProfileImage } )(UploadImage);
