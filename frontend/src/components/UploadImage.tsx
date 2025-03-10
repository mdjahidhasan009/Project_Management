import React, {ChangeEvent, FormEvent, useState} from 'react';
import { useNavigate } from "react-router-dom";

import { useHttpClient } from "../hooks/http-hook";
import Swal from "sweetalert2";
import {uploadProfileImage} from "../redux/thunks/auth-thunks";
import {useAppDispatch} from "../redux/hooks";
// import M from "materialize-css";

const UploadImage: React.FC<{ profileImageUrl: string }> = ({ profileImageUrl }) => {
    const navigate = useNavigate();
    const { sendRequest } = useHttpClient();
    const dispatch = useAppDispatch();
    const [ fileInputState, setFileInputState ] = useState<string>('');//Image url temporary(for input tag)
    const [ previewSource, setPreviewSource ] = useState<string>('');//converted normal image to base64EncodedImage format
    const [ selectedFile, setSelectedFile ] = useState<File | null>(null);//for check is any file selected or not before submitting
    const [ loading, setLoading ] = useState<boolean>(false);

    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null; //File data with file

        if(file) {
            previewFile(file);
            setSelectedFile(file);
            setFileInputState(event.target.value);
        }
    };

    const previewFile = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result as string);
        };
        reader.onerror = () => {
            //TODO: HAVE TO FIX
            // M.toast({html: 'Image upload failed, Please try again', classes: 'red'});
            Swal.fire({
                title: 'Error!',
                text: 'Image upload failed',
                icon: 'error',
            });
        };
    };

    const handleSubmitFile = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (!selectedFile) return;
        await uploadImage(previewSource)
    };

    const uploadImage = async (base64EncodedImage: string): Promise<void> => {
        setLoading(true);
        dispatch(uploadProfileImage({ base64EncodedImage: base64EncodedImage, method: sendRequest }));
        setLoading(false);
        navigate('/profile/');
    };

    return (
        <>
            {/* Profile Image */}
            {!previewSource && (
                <div className="w-60 mb-10">
                    <img
                        src={profileImageUrl}
                        alt="Add Profile Image"
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
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
                    <input
                        id="fileInput"
                        type="file"
                        name="image"
                        onChange={handleFileInputChange}
                        value={fileInputState}
                        className="form-input mt-2 p-2 rounded-lg"
                    />
                </div>
                <button className="btn mt-4">
                    {loading && <i className="fas fa-spinner fa-pulse mr-2" />}
                    {loading ? 'Uploading Image' : 'Upload ProfileScreen Image'}
                </button>
            </form>
        </>
    );
};

export default UploadImage;
// export default connect(null, { uploadProfileImage } )(UploadImage);
