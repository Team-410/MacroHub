import { useTheme } from '@mui/material/styles';

const GlobalStyle = () => {
    const theme = useTheme();

    return (
        <style>
            {`
                body {
                    background-color: ${theme.palette.background.default};
                    color: ${theme.palette.text.primary};
                    display: flex;
                    justify-content: center;
                    padding-bottom: 100px;
                }

                ::-webkit-scrollbar {
                    width: 6px;
                }

                ::-webkit-scrollbar-track {
                    background: transparent;
                }

                ::-webkit-scrollbar-thumb {
                    background-color: #f9f9f9;
                    border-radius: 10px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background-color: #90a4ae;
                }
            `}
        </style>
    );
};

export default GlobalStyle;
