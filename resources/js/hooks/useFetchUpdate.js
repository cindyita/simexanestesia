import { useState, useCallback } from "react";
import axios from "axios";

export function useFetchUpdate() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [responseData, setResponseData] = useState(null);

    const fetchUpdate = useCallback(
        async (url, payload = {}, options = {}) => {
            const {
                method = "POST",
                headers = {},
                saveResponse = false,
                transformData = null
            } = options;

            setLoading(true);
            setError(null);
            setSuccess(false);
            setResponseData(null);

            try {
                const axiosConfig = {
                    method,
                    url,
                    headers,
                    data: payload
                };

                const response = await axios(axiosConfig);

                let data = response.data;

                if (transformData && typeof transformData === "function") {
                    data = transformData(data);
                }

                if (saveResponse) {
                    setResponseData(data);
                }

                setSuccess(true);
                return data;
            } catch (err) {
                console.error(`Error updating ${url}:`, err);
                setError({
                    message: err.message,
                    status: err.response?.status,
                    data: err.response?.data
                });
                setSuccess(false);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const clearError = useCallback(() => setError(null), []);
    const clearResponse = useCallback(() => setResponseData(null), []);

    return {
        fetchUpdate,
        loading,
        error,
        success,
        responseData,
        clearError,
        clearResponse
    };
}
