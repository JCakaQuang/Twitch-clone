import { Navbar } from "./_component/navbar";
import { Sidebar } from "./_component/sidebar";
import { Container } from "./_component/container";

const BrowseLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <>
            <Navbar />
            <div className="flex h-full pt-20">
                <Container>
                    {children}
                </Container>

            </div>
        </>
    );
}

export default BrowseLayout;