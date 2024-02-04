import { useEffect, useState } from "react";

import "./App.css";
import { quotesUrl } from "./constants";
import { Box, Container, CssBaseline, Typography } from "@mui/material";
import QuotesCard from "./components/QuotesCard";

function App() {
    const [quotes, setQuotes] = useState([]);
    const defaultQuote =
        "All our dreams can come true, if we have the courage to pursue them.";

    const randomQuote =
        quotes?.[Math.floor(Math.random() * 18)]?.text || defaultQuote;

    const fetchQuotes = async () => {
        try {
            const fetchUrlData = await fetch("https://type.fit/api/quotes");
            const res = await fetchUrlData.json();

            console.log({ res });

            setQuotes(res);
        } catch (error) {
            console.log("Error : ", error);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    return (
        <>
            <CssBaseline />
            <Container>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        padding: "1rem",
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{ fontFamily: "Pacifico", marginBottom: "1.25rem" }}
                    >
                        {" "}
                        Quotes Generator
                    </Typography>

                    <QuotesCard quote={randomQuote} />
                </Box>
            </Container>
        </>
    );
}

export default App;
