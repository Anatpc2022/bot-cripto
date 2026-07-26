import Footer from "../components/Footer";
import SideBar from "../components/Menu/SideBar";
import Toast from "../components/Toast";
import RiberBotChat from "../components/Chat/RiberBotChat";

export default function TemplatePage({ children }) {
  return (
    <>
      <SideBar />
      <main className="content">
        {children}
        <Footer />
      </main>
      <RiberBotChat />
      <Toast />
    </>
  );
}
