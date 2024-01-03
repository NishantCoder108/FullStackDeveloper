import {
    createBrowserRouter,
    RouterProvider,
    Route,
    createRoutesFromElements,
    Link,
} from "react-router-dom";
import "./App.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                Home Page <Link to="/about">About </Link>
            </>
        ),
        errorElement: "Error page",
    },
    {
        path: "about",
        element: (
            <>
                About page <Link to="/">HoME</Link>
            </>
        ),
    },
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
