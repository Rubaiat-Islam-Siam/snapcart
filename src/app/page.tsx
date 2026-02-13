import { redirect } from "next/navigation";
import { auth } from "../auth";
import connectDb from "../lib/db";
import User from "../models/user.model";
import EditRoleMobile from "../Components/EditRoleMobile";
import Nav from "../Components/Nav";


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
  return (
    <div>
       <Nav user={plainUser}/>
    </div>
  );
}
