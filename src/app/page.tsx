import { auth } from "../auth";
import connectDb from "../lib/db";
import User from "../models/user.model";
import EditRoleMobile from "../Components/EditRoleMobile";
import Nav from "../Components/Nav";
import UserDashboard from "../Components/UserDashboard";
import AdminDashboard from "../Components/AdminDashboard";
import GeoUpdater from "../Components/GeoUpdater";
import Delivery from "../Components/Delivery";
import Grocery, { IGrocery } from "../models/grocery.model";
import Footer from "../Components/Footer";

export default async function Home(props: {
  searchParams: Promise<{ search?: string }>;
}) {

  const searchParams = await props.searchParams
  await connectDb()
  const session = await auth();
  const user = session?.user?.id ? await User.findById(session.user.id) : null

  // If not logged in, show public storefront with groceries only
  if(!user) {
    let groceryList:IGrocery[] = []
    if(searchParams.search){
      groceryList = await Grocery.find({
        $or: [
          { name: { $regex: searchParams.search, $options: "i" } },
          { category: { $regex: searchParams.search, $options: "i" } },
        ],
      }).lean()
    } else {
      groceryList = await Grocery.find({}).lean()
    }

    return (
      <div>
        <Nav/>
        <UserDashboard groceryList={groceryList}/>
        <Footer/>
      </div>
    )
  }

  const inComplete = !user.mobile || !user.role || (!user.mobile && user.role=="user")

  if(inComplete)
    return <EditRoleMobile/>

  const plainUser = JSON.parse(JSON.stringify(user))
  console.log(plainUser)

  let groceryList:IGrocery[] = []
  if(user.role == "user"){
    if(searchParams.search){
      groceryList = await Grocery.find({
        $or: [
          { name: { $regex: searchParams.search, $options: "i" } },
          { category: { $regex: searchParams.search, $options: "i" } },
        ],
      }).lean()
    } else {
      groceryList = await Grocery.find({}).lean()
    }
  }
  
  return (
    <div>
       <Nav user={plainUser}/>
       <GeoUpdater userId={plainUser._id}/>
       {user.role == "user"?(
        <UserDashboard groceryList={groceryList}/>
       ):
        user.role=="admin"?(
          <AdminDashboard/>
        ) : <Delivery/>
       } 
       <Footer/>
    </div>
  );
}
