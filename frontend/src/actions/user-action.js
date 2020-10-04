import M from "materialize-css";

//Upload or change profile image
export const uploadProfileImage = (base64EncodedImage, method) => async dispatch => {
    try {
        await method(
            process.env.REACT_APP_ASSET_URL + '/api/upload',
            'POST',
            JSON.stringify({ data: base64EncodedImage }),
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Image uploaded successfully', classes: 'green'});
    } catch (err) {
        console.error(err);
    }
}
