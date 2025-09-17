import { useState, useCallback } from "react";
import axios from "axios";

export function useFetchDetails() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDetails = useCallback(async (url, params = {}, headerMap = {}) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(url, { 
                params: params
            });
            
            if (!response.data || !Array.isArray(response.data)) {
                console.warn("Response data is not an array:", response.data);
                return [];
            }
            
            const formattedData = response.data.map(item => {
                let newItem = {};
                
                if (Object.keys(headerMap).length === 0) {
                    return item;
                }
                
                for (const key in headerMap) {
                    if (item.hasOwnProperty(key)) {
                        newItem[headerMap[key]] = item[key];
                    }
                }
                return newItem;
            });
            
            return formattedData;
            
        } catch (err) {
            console.error("Error fetching details:", err);
            setError(err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return { 
        fetchDetails, 
        loading, 
        error,
        clearError
    };
}

export function useFetchDetailsAdvanced() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    const fetchDetails = useCallback(async (url, params = {}, headerMap = {}, options = {}) => {
        const {
            method = 'GET',
            headers = {},
            saveToState = false,
            transformData = null
        } = options;

        setLoading(true);
        setError(null);
        
        try {
            const axiosConfig = {
                method,
                url,
                headers,
                ...(method === 'GET' ? { params } : { data: params })
            };
            
            const response = await axios(axiosConfig);
            
            let responseData = response.data;
            
            if (transformData && typeof transformData === 'function') {
                responseData = transformData(responseData);
            }
            
            if (!Array.isArray(responseData)) {
                console.warn("Response data is not an array:", responseData);
                const result = responseData;
                if (saveToState) setData(result);
                return result;
            }
            
            const formattedData = responseData.map(item => {
                if (Object.keys(headerMap).length === 0) {
                    return item;
                }
                
                let newItem = {};
                for (const key in headerMap) {
                    if (item.hasOwnProperty(key)) {
                        newItem[headerMap[key]] = item[key];
                    }
                }
                return newItem;
            });
            
            if (saveToState) {
                setData(formattedData);
            }
            
            return formattedData;
            
        } catch (err) {
            console.error(`Error fetching ${url}:`, err);
            setError({
                message: err.message,
                status: err.response?.status,
                data: err.response?.data
            });
            
            if (saveToState) {
                setData([]);
            }
            
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);
    const clearData = useCallback(() => setData([]), []);

    return { 
        fetchDetails, 
        loading, 
        error,
        data,
        clearError,
        clearData
    };
}