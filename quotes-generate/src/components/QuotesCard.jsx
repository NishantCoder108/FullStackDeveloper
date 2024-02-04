/* eslint-disable react/prop-types */
import { Box, Card, CardContent, Paper, Typography } from "@mui/material";

const QuotesCard = ({ quote }) => {
    return (
        <div>
            <Box>
                <Paper elevation={24}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography
                                color="text.secondary"
                                gutterBottom
                                mb={"1rem"}
                            >
                                {" "}
                                Quotes of the Day
                            </Typography>
                            <Typography
                                component={"div"}
                                variant="h3"
                                gutterBottom
                                sx={{
                                    fontFamily: "Sacramento",
                                }}
                            >
                                {" "}
                                {quote}
                            </Typography>
                        </CardContent>
                    </Card>
                </Paper>
            </Box>
        </div>
    );
};

export default QuotesCard;
