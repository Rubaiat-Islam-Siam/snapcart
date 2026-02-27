import { redirect } from "next/navigation";
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
  const user = await User.findById(session?.user?.id)
  if(!user)
    redirect("/login")

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
