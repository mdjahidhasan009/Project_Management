import {UPLOAD_PROFILE_IMAGE} from './types';

export const uploadProfileImage = (base64EncodedImage, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/upload',
            'POST',
            JSON.stringify({ data: base64EncodedImage }),
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        );
        console.log(responseData);
        // await fetch(process.env.REACT_APP_ASSET_URL + '/api/upload', {
        //     method: 'POST',
        //     body: JSON.stringify({ data: base64EncodedImage }),
        //     headers: { 'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + localStorage.token
        //     },
        // });
        // setFileInputState('');
        // setPreviewSource('');
        // setSuccessMsg('Image uploaded successfully');
    } catch (err) {
        console.error(err);
        // setErrMsg('Something went wrong!');
    }
}
