
const UnauthorizedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
            <p className="text-lg">
                You do not have permission to access this page. Please contact the administrator if you believe this is a mistake.
            </p>
        </div>
    );
};

export default UnauthorizedPage;

