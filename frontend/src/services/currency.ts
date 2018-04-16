export const currencyService = {
    getAll
};
function getAll() {
    const requestOptions = {
        method: 'GET'
    };
    return fetch('/currency', requestOptions).then(handleResponse);
}

function handleResponse(response:Response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}