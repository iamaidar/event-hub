
const UnauthorizedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Доступ запрещён</h1>
            <p className="text-lg">
                У вас нет прав для доступа к этой странице. Пожалуйста, обратитесь к администратору, если считаете, что это ошибка.
            </p>
        </div>
    );
};

export default UnauthorizedPage;
