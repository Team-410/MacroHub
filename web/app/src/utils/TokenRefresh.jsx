import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const TokenRefresh = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const refreshAuthToken = async () => {
      const oldToken = localStorage.getItem("authToken");

      // Jos tokenia ei ole, ei tehdä mitään
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
          console.log("Uusi token vastaanotettu", newToken);

          // Tallennetaan uusi token localStorage:hen
          localStorage.setItem("authToken", newToken);
        } else {
          console.log("Palautettiin muuta kuin 200 status:", response.status);
          // Poistetaan authToken, jos vastaus ei ollut onnistunut
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Tokenin päivitys epäonnistui", error);
        // Poistetaan authToken, jos virhe tapahtui
        localStorage.removeItem("authToken");
      }
    };

    refreshAuthToken();
  }, [location]);

  return <>{children}</>;
};

export default TokenRefresh;
