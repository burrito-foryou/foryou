import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <header>Header</header>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  );
};
export default AppLayout;
