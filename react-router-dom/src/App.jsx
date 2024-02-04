import {
    createBrowserRouter,
    RouterProvider,
    Route,
    createRoutesFromElements,
    Link,
    Outlet,
    useParams,
} from "react-router-dom";
import "./App.css";

function Task() {
    const { projectId, taskId } = useParams();
    console.log("Task", { projectId }, { taskId });

    return (
        <h1>
            {" "}
            ProjectId : {projectId} --: : -- TaskId :{taskId}{" "}
        </h1>
    );
}

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: (
//             <>
//                 Home Page <Link to="/about">About </Link>
//             </>
//         ),
//         errorElement: "Error page",
//     },
//     {
//         path: "about",
//         element: (
//             <>
//                 About page <Link to="/">HoME</Link>
//             </>
//         ),
//     },
// ]);

// const router = createBrowserRouter(
//     createRoutesFromElements(
//         <Route
//             path="/"
//             element={
//                 <div>
//                     <h2>Root</h2> <Outlet />
//                 </div>
//             }
//             errorElement={<p>404 Not Found</p>}
//         >
//             <Route path="about" element={<h1>This is About page</h1>} />
//             <Route path="contact" element={<h2>This is contact page</h2>} />

//             <Route
//                 element={
//                     <div>
//                         AuthRoute <Outlet />
//                     </div>
//                 }
//             >
//                 <Route path="login" element={<h3>Login </h3>} />
//                 <Route path="signup" element={<h3>Sign up </h3>} />
//                 <Route path="logout" element={<h3>Logout </h3>} />
//             </Route>
//         </Route>
//     )
// );

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={
                <div>
                    Home <Outlet />
                </div>
            }
            errorElement={<p>404 Not Found</p>}
        >
            <Route
                path="projects/:projectId/tasks/:taskId"
                // loader={({ params }) => {
                //     console.log("loader : params -->", params);
                // }}
                // action={({ params }) => {}}
                element={<Task />}
                // element={<p>Task</p>}
            />
        </Route>
    )
);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;

/**
 * ----Routing setup , we can these two method------
 *
 *  1. JSX method    -->Recommended for ,easy to understand
 *  2. Object method  --> it sometime hard in nested routes
 *
 *
 *
 * so, here , we use Jsx method
 *
 *
 * _______________   Dynamic Segments _______________
 *
 *    path="/project/:projectId/tasks/:taskId"
 *
 *    - here , projectId and taskId will be change
 */
