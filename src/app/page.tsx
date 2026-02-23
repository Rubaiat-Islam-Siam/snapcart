import { redirect } from "next/navigation";
import { auth } from "../auth";
import connectDb from "../lib/db";
import User from "../models/user.model";
import EditRoleMobile from "../Components/EditRoleMobile";
import Nav from "../Components/Nav";
import UserDashboard from "../Components/UserDashboard";
import AdminDashboard from "../Components/AdminDashboard";
import DeliveryDashboad from "../Components/DeliveryDashboad";
import GeoUpdater from "../Components/GeoUpdater";
import Delivery from "../Components/Delivery";


export default async function Home() {
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
  return (
    <div>
       <Nav user={plainUser}/>
       <GeoUpdater userId={plainUser._id}/>
       {user.role == "user"?(
        <UserDashboard/>
       ):
        user.role=="admin"?(
          <AdminDashboard/>
        ) : <Delivery/>
       }
    </div>
  );
}
