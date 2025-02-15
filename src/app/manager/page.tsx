import Link from "next/link";

export default async function ManagerPage() {
   
  return (
    <div >
      <h1>Manager Page</h1>
      <Link href="/manager/locations">Locations</Link>
    </div> 
  );
}
