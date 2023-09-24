// import M from "materialize-css";

//Upload or change profile image
import Swal from "sweetalert2";

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
        //TODO: HAVE TO FIX
        // M.toast({html: 'Image uploaded successfully', classes: 'green'});
        Swal.fire({
            title: 'Success',
            text: 'Image uploaded successfully',
            icon: 'success',
        });
    } catch (err) {
        console.error(err);
    }
}
