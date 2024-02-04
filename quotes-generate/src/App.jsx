import { useEffect, useState } from "react";

import "./App.css";
import { Box, Button, Container, CssBaseline, Typography } from "@mui/material";
import QuotesCard from "./components/QuotesCard";

function App() {
    const [quotes, setQuotes] = useState([]);
    const defaultQuote =
        "All our dreams can come true, if we have the courage to pursue them.";

    const [quote, setQuote] = useState(defaultQuote);

    const generateQuote = () => {
        const randomQuote =
            quotes?.[Math.floor(Math.random() * quotes.length)]?.text ||
            defaultQuote;
        setQuote(randomQuote);
    };

    const tweetQuote = () => {
        const tweetTemp = "Quotes of the Day 💪: " + '"' + quote + '"';
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            tweetTemp
        )}`;
        window.open(tweetUrl);
    };
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

                    <QuotesCard quote={quote} />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            gap: "1rem",
                            padding: "2rem",
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={generateQuote}
                        >
                            New Quote{" "}
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={tweetQuote}
                        >
                            Share on Twitter{" "}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default App;
