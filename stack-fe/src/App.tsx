import JWTProvider from "@/providers/jwt-provider";
import PublicProvider from "@/providers/public-provider";
import Routes from "@/routes";

function App() {
  return (
    <JWTProvider>
      <PublicProvider>
        <Routes />
      </PublicProvider>
    </JWTProvider>
  );
}

export default App;
