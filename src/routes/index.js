import Recommend from "../pages/Home/Recommend";
import Follow from "../pages/Home/Follow";
import Home from "../pages/Home"
import CreateArticle from '../pages/Home/CreateArticle'

export default[
    {
        path:"/home",
        element:<Home/>,
        children:[
            {
                path:"/home/recommend",
                element:<Recommend/>
            },
            {
                path:"/home/follow",
                element:<Follow/>
            },
            
        ]
    },
    {
        path:"createArticle/:id",
        element:<CreateArticle/>
    },




]