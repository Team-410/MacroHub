import axios from "axios";
import { useState, useEffect } from "react";

import { Box, Typography } from "@mui/material";

function PersonalList() {
    const [list, setList] = useState([]);
    const [, setLoading] = useState(true);
    const [ ,setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
    
        if (!token) {
            setError("Authentication token not found.");
            setLoading(false);
            return;
        }
    
        axios
            .get("/api/personal_list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data) {
                    console.log(response);
                    setList(response.data.results);
                } else {
                    setError("List not found.");
                }
            })
            .catch(() => {
                setError("Unable to fetch macro data.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <Box>
            <Typography>Personal List</Typography>
            {list && list.length > 0 ? (
                <ul>
                    {list.map((item, index) => (
                        <li key={index}>{item.macroname}</li>
                    ))}
                </ul>
            ) : (
                <Typography>No items found.</Typography>
            )}
        </Box>
    );
}

export default PersonalList;
