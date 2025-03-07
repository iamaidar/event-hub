import api from "./axiosInstance";

export interface CategoryType {
    id: number;
    name: string;
    is_verified?: boolean;
    description?: string;
    parent?: {
        id: number;
        name: string;
    };
    children?: CategoryType[];
}

// Если на бекенде реализована пагинация для категорий,
// можно использовать этот интерфейс
export interface PaginatedCategories {
    data: CategoryType[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
}

// Получение всех категорий (без пагинации)
export const fetchCategories = async (): Promise<CategoryType[]> => {
    const response = await api.get("/categories/all");
    return response.data.data;
};

// Получение категорий с пагинацией (если требуется)
export const fetchPaginatedCategories = async (page: number = 1, limit: number = 10): Promise<PaginatedCategories> => {
    const response = await api.get("/categories", { params: { page, limit } });
    const paginatedData = response.data.data;
    return {
        data: paginatedData.data,
        total: paginatedData.total,
        page: paginatedData.page,
        limit: paginatedData.limit,
        totalPages: paginatedData.totalPages,
        nextPage: paginatedData.nextPage,
    };
};

// Получение категории по идентификатору
export const fetchCategoryById = async (id: number | string): Promise<CategoryType> => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
};

// Создание новой категории
export const createCategory = async (
    category: Omit<CategoryType, "id" | "children">
): Promise<CategoryType> => {
    const response = await api.post("/categories", category);
    return response.data.data;
};

// Обновление категории
export const updateCategory = async (
    id: number | string,
    category: Partial<CategoryType>
): Promise<CategoryType> => {
    const response = await api.patch(`/categories/${id}`, category);
    return response.data.data;
};

// Удаление категории
export const deleteCategory = async (id: number | string): Promise<void> => {
    await api.delete(`/categories/${id}`);
};
