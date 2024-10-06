import JWTProvider from "@/providers/jwt-provider";
import PublicProvider from "@/providers/public-provider";
import Routes from "@/routes";
import LoadingSpinner from "@/components/LoadingSpinner";
function App() {
  return (
    <JWTProvider>
      <PublicProvider>
        <Routes />
        <LoadingSpinner />
      </PublicProvider>
    </JWTProvider>
  );
}

export default App;
