import React, { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { SocialIcon } from 'react-social-icons';

const Footer = () => {
    const [hoveredLink, setHoveredLink] = useState(null);
    const [hoveredApp, setHoveredApp] = useState(null);
    const year = new Date().getFullYear();

    const handleMouseEnter = (link, appName) => {
        setHoveredLink(link);
        setHoveredApp(appName);
    };

    const handleMouseLeave = () => {
        setHoveredLink(null);
        setHoveredApp(null);
    };

    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.qrContainer}>
                    <QRCode
                        value="https://discord.com/channels/1328634248449757194/1328635140183822398"
                        size={150}
                        fgColor="#fff"
                        bgColor="transparent"
                    />
                    <p style={styles.qrText}>
                        Scan and join our discord community!
                    </p>
                </div>

                <div style={styles.socialLinks}>
                    <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={hoveredLink === "instagram" ? { ...styles.link, ...styles.linkHover } : styles.link}
                        onMouseEnter={() => handleMouseEnter("instagram", "Instagram")}
                        onMouseLeave={handleMouseLeave}
                    >
                        <SocialIcon url="https://instagram.com" />
                    </a>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        style={hoveredLink === "facebook" ? { ...styles.link, ...styles.linkHover } : styles.link}
                        onMouseEnter={() => handleMouseEnter("github", "Github")}
                        onMouseLeave={handleMouseLeave}
                    >
                        <SocialIcon url="https://github.com/Team-410/MacroHub" />
                    </a>
                    <a
                        href="https://x.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={hoveredLink === "x" ? { ...styles.link, ...styles.linkHover } : styles.link}
                        onMouseEnter={() => handleMouseEnter("x", "X")}
                        onMouseLeave={handleMouseLeave}
                    >
                        <SocialIcon url="https://x.com" />
                    </a>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        style={hoveredLink === "discord" ? { ...styles.link, ...styles.linkHover } : styles.link}
                        onMouseEnter={() => handleMouseEnter("discord", "Discord")}
                        onMouseLeave={handleMouseLeave}
                    >
                        <SocialIcon url="https://discord.com/channels/1328634248449757194/1328635140183822398" />
                    </a>
                </div>

                <div style={{ ...styles.appBox, opacity: hoveredApp ? 1 : 0 }}>
                    {hoveredApp}
                </div>

                <div style={styles.copyRight}>
                    <p>&copy; {year} MacroHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        marginTop: "100px",
        color: "#fff",
        padding: "40px 20px",
        textAlign: "center",
        borderRadius: "5px",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "30px",
    },
    qrContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
    },
    qrText: {
        fontSize: "16px",
        fontWeight: "300",
        color: "#fff",
    },
    socialLinks: {
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    appBox: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        fontSize: "14px",
        transition: "opacity 0.5s ease-in-out",
        pointerEvents: "none",
    },
    copyRight: {
        fontSize: "14px",
        fontWeight: "300",
    },
    link: {
        color: "#fff",
        textDecoration: "none",
        fontSize: "18px",
        fontWeight: "400",
        transition: "color 0.3s ease",
    },
    linkHover: {
        color: "#44449E",
    },
};

export default Footer;
