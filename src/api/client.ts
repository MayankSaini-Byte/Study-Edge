import axios from 'axios';

const client = axios.create({
    baseURL: `http://${window.location.hostname}:8000`, // Dynamically connect to the backend on the same host
    withCredentials: true, // Important for HttpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to handle auth errors or global error logging
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Logic to redirect to login if session expires
            // window.location.href = '/login'; // Optional: Use with caution to avoid loops
            console.warn("Unauthorized: Session might have expired");
        }
        return Promise.reject(error);
    }
);

export const api = {
    login: (name: string, scholar_no: string) => client.post('/auth/login', { name, scholar_no }),
    logout: () => client.post('/auth/logout'),
    getMe: () => client.get('/me'),


    getAssignments: () => client.get('/assignments'),
    createAssignment: (title: string, due_date?: string, pdf_file?: string) => client.post('/assignments', { title, due_date, pdf_file }),
    updateAssignment: (id: number, status: string) => client.patch(`/assignments/${id}`, { status }),
    deleteAssignment: (id: number) => client.delete(`/assignments/${id}`),

    getTodos: () => client.get('/todos'),
    createTodo: (title: string) => client.post('/todos', { title }),
    updateTodo: (id: number, completed: boolean) => client.patch(`/todos/${id}`, { completed }),
    deleteTodo: (id: number) => client.delete(`/todos/${id}`), // Assuming this exists or needed

    getMessMenu: (day: string) => client.get(`/mess-menu?day=${day}`),
    updateMessMenu: (day: string, data: any) => client.patch(`/mess-menu/${day}`, data),

    // profile endpoints if they exist in backend, otherwise mock or remove
    // profile endpoints - MOCKED (Backend Schema update required for persistence)
    getProfile: () => Promise.resolve({
        data: {
            profile: {
                fullName: "Mayank Saini",
                semester: "6th",
                branch: "CSE",
                hostel: "Hostel 4",
                rollNo: "21001001001",
                section: "A",
                gender: "Male",
                primary_goal: "Placement"
            }
        }
    }),
    updateProfile: (profile: any) => Promise.resolve({
        data: {
            success: true,
            profile
        }
    }),
};

export default client;
