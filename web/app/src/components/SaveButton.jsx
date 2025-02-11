import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";

const SaveButton = ({ macroid, userId }) => {
    const handleSave = () => {
        if (!userId) return alert("You need to log in to save to mylist!");
        axios.post(`http://localhost:5000/api/personal_list`, { macroid, userId })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                if (error.response && error.response.status === 400 && error.response.data.message === "Macro already in personal list") {
                    alert("This macro is already in your personal list.");
                } else {
                    console.error("Error saving to mylist:", error);
                }
            });
    };
        
    return (
        <Button variant="contained" sx={{ mt: 5, mr: 2, padding: 1 }} onClick={handleSave}>Save to my list</Button>
    );

};
export default SaveButton;