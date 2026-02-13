import { redirect } from "next/navigation";
import { auth } from "../auth";
import connectDb from "../lib/db";
import User from "../models/user.model";
import EditRoleMobile from "../Components/EditRoleMobile";


export default async function Home() {
  await connectDb()
  const session = await auth();
  const user = await User.findById(session?.user?.id)
  if(!user)
    redirect("/login")

  const inComplete = !user.mobile || !user.role || (!user.mobile && user.role=="user")

  if(inComplete)
    return <EditRoleMobile/>
  return (
    <div>
       
    </div>
  );
}
