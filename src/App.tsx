import Right from "./components/Right";
import TopBar from "./components/TopBar";

function App() {
  return (
    <div className="h-screen w-full bg-transparent">
      <TopBar />
      <div className="flex h-[calc(100%-25px)] w-full items-center justify-center">
        <Right />
      </div>
    </div>
  );
}

export default App;
