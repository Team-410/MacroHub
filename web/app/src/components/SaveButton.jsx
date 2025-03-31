import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";

const SaveButton = ({ macroid }) => {
    const API_URL = import.meta.env.VITE_BASE_API_URL;
    const token = localStorage.getItem("authToken");

    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        axios.get(`${API_URL}/api/personal_list`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            const exists = response.data.results.some(item => item.macroid === macroid);
            setSaved(exists);
        })
        .catch(err => {
            console.error("Error fetching personal list:", err);
        })
        .finally(() => setLoading(false));
    }, [macroid, token]);

    const handleClick = () => {
        if (!token) return alert("You need to log in to manage your list!");

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        if (saved) {
            // Remove from list
            axios.delete(`${API_URL}/api/personal_list`, {
                ...config,
                data: { macroid }
            })
            .then(res => {
                alert(res.data.message);
                setSaved(false);
            })
            .catch(err => {
                console.error("Error removing macro:", err);
            });
        } else {
            // Save to list
            axios.post(`${API_URL}/api/personal_list`, { macroid }, config)
            .then(res => {
                alert(res.data.message);
                setSaved(true);
            })
            .catch(err => {
                if (err.response?.data?.message) {
                    alert(err.response.data.message);
                } else {
                    console.error("Error saving macro:", err);
                }
            });
        }
    };

    if (loading) return null; // Or a loading indicator if you prefer

    return (
        <Button
            variant="contained"
            sx={{ mt: 5, mr: 2, padding: 1 }}
            onClick={handleClick}
        >
            {saved ? "Remove from the list" : "Save to my list"}
        </Button>
    );
};

export default SaveButton;
