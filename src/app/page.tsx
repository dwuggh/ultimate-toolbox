import HeaderNavigationMenu from "./components/HeaderNavigationMenu";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Navigation Menu --- */}
      {/* <HeaderNavigationMenu /> */}

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 text-center">
          {/* Centered Description */}
          <div className="max-w-3xl mx-auto"> {/* Constrain width */}
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              Welcome to the Future of Something Amazing
            </h1>
          </div>
        </div>
      </main>

      {/* --- Optional Footer --- */}
      {/* <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} MyApp. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
}