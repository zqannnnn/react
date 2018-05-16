import {authHeader} from '../helpers/auth';
import { Offer } from '../models'
export const uploadService = {
    uploadImage
}
function uploadImage(file:File) {
    const formData = new FormData();
    formData.append('image',file)
    const requestOptions = {
        method: 'POST',
        headers: {
            ...authHeader()
        },
        body: formData
    };
    return fetch('/upload/image', requestOptions).then(handleResponse);
}
function handleResponse(response:Response) {
    if (!response.ok) {
        return Promise.reject(response.json());
    }

    return response.json();
}