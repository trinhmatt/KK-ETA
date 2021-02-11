import AppRouter from "./router/Router";

function App() {
  // const script = document.createElement('script'); 
  // script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_KEY}&libraries=places`
  // document.head.append(script);
  return (
    <AppRouter />
  );
}


export default App;

//GENERATE_SOURCEMAP=false <---- PUT THAT BACK IN BUILD SCRIPT!!!