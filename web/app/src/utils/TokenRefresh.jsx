import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const TokenRefresh = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const refreshAuthToken = async () => {
            const oldToken = localStorage.getItem("authToken");

            if (!oldToken) return;

            try {
                const response = await axios.get("/api/token/refresh", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${oldToken}`,
                    },
                });

                if (response.status === 200) {
                    const newToken = response.data.token;
                    console.log("New token", newToken);

                    localStorage.setItem("authToken", newToken);
                } else {
                    console.log(
                        "Error refreshing token, status code",
                        response.status
                    );
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("fullname");
                }
            } catch (error) {
                console.error("Token refresh failed", error);
                localStorage.removeItem("authToken");
                localStorage.removeItem("fullname");
            }
        };

        refreshAuthToken();
    }, [location]);

    return <>{children}</>;
};

export default TokenRefresh;
