

const mockLocations = [
  {id: 1, name: "Location1"},
  {id: 2, name: "Location2"},
  {id: 3, name: "Location3"},
]


function TopNav() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div>Logo</div>
      <div>Sign in</div>
    </nav>
  );
}

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col    bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
      <TopNav/>
      <h1>hello</h1>
      {mockLocations.map(location => <div key={location.id}>{location.name}</div>)}
    </main>
  );
}
