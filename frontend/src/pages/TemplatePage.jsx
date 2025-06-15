import Footer from "../components/Footer";
import SideBar from "../components/Menu/SideBar";
import Toast from "../components/Toast";

export default function TemplatePage({ children }) {
  return (
    <>
      <SideBar />
      <main className="content">
        {children}
        <Footer />
      </main>
      <Toast />
    </>
  );
}
