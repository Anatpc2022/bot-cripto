import Footer from "../components/Footer"
import SideBar from "../components/Menu/SideBar"

export default function TemplatePage({ children }) {
    return (
        <>
            <SideBar />
            <main className="content">
                {children}
                <Footer />
            </main>
        </>
    )
}