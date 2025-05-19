const AuthLayout = ({ children 

}: { 
    children: React.ReactNode 
}) => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-100">
            {children}
        </div>
    );
};
export default AuthLayout