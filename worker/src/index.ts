/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// In-memory database (Note: Data persists only while the worker isolate is alive. For production, use D1 or KV)
const db = {
	users: [] as any[],
	sessions: [] as any[],
	otps: [] as any[],
	assignments: [] as any[],
	todos: [] as any[],
	mess_menu: [
		{ day: 'monday', breakfast: 'Poha, Tea', lunch: 'Dal, Rice, Roti, Sabzi', tea_time: 'Samosa, Chai', dinner: 'Rajma, Rice, Roti' },
		{ day: 'tuesday', breakfast: 'Idli, Sambar, Chutney', lunch: 'Chole, Rice, Roti', tea_time: 'Pakora, Coffee', dinner: 'Paneer Curry, Roti' },
		{ day: 'wednesday', breakfast: 'Upma, Tea', lunch: 'Dal Fry, Rice, Roti', tea_time: 'Biscuits, Chai', dinner: 'Veg Biryani' },
		{ day: 'thursday', breakfast: 'Paratha, Curd, Pickle', lunch: 'Sambar, Rice, Roti', tea_time: 'Bread Pakora, Tea', dinner: 'Dal Makhani, Roti' },
		{ day: 'friday', breakfast: 'Aloo Puri, Tea', lunch: 'Kadhi, Rice, Roti', tea_time: 'Kachori, Chai', dinner: 'Chicken Curry, Rice' },
		{ day: 'saturday', breakfast: 'Sandwich, Tea', lunch: 'Rajma, Rice, Roti', tea_time: 'Spring Roll, Coffee', dinner: 'Fried Rice, Manchurian' },
		{ day: 'sunday', breakfast: 'Dosa, Chutney, Sambhar', lunch: 'Special Thali', tea_time: 'Jalebi, Milk Tea', dinner: 'Pizza, Pasta' }
	]
};

let userIdCounter = 1;
let assignmentIdCounter = 1;
let todoIdCounter = 1;

function generateSessionToken() {
	return crypto.randomUUID();
}

function getUserFromSession(request: Request) {
	const cookieHeader = request.headers.get('Cookie') || '';
	const sessionToken = cookieHeader.split(';').find(c => c.trim().startsWith('session='))?.split('=')[1];
	if (!sessionToken) return null;

	const session = db.sessions.find(s => s.token === sessionToken && new Date(s.expires_at) > new Date());
	return session ? db.users.find(u => u.id === session.user_id) : null;
}

function corsHeaders(origin: string) {
	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Allow-Credentials': 'true',
	};
}

export default {
	async fetch(request: Request, env: any, ctx: any): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method;
		const origin = request.headers.get('Origin') || '*';
		const headers = corsHeaders(origin);

		if (method === 'OPTIONS') {
			return new Response(null, { headers });
		}

		try {
			// Helper to get JSON body
			const getBody = async () => {
				try { return await request.json() as any; } catch { return {}; }
			};

			// POST /auth/login
			if (path === '/auth/login' && method === 'POST') {
				const data = await getBody();
				const { name, scholar_no } = data;

				if (!name || !scholar_no) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers });
				if (!/^\d{11}$/.test(scholar_no)) return new Response(JSON.stringify({ error: 'Scholar number must be 11 digits' }), { status: 400, headers });

				let user = db.users.find(u => u.scholar_no === scholar_no);
				if (!user) {
					user = { id: userIdCounter++, name, scholar_no, created_at: new Date() };
					db.users.push(user);
				} else {
					user.name = name;
				}

				const sessionToken = generateSessionToken();
				const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
				db.sessions.push({ token: sessionToken, user_id: user.id, expires_at: sessionExpiry });

				const cookie = `session=${sessionToken}; HttpOnly; SameSite=None; Secure; Max-Age=${7 * 24 * 60 * 60}; Path=/`;

				const responseHeaders = new Headers(headers);
				responseHeaders.append('Set-Cookie', cookie);

				return new Response(JSON.stringify({ success: true, user: { id: user.id, name: user.name, scholar_no: user.scholar_no } }), { headers: responseHeaders });
			}

			// POST /auth/logout
			if (path === '/auth/logout' && method === 'POST') {
				const cookieHeader = request.headers.get('Cookie') || '';
				const sessionToken = cookieHeader.split(';').find(c => c.trim().startsWith('session='))?.split('=')[1];
				db.sessions = db.sessions.filter(s => s.token !== sessionToken);

				const responseHeaders = new Headers(headers);
				responseHeaders.append('Set-Cookie', 'session=; HttpOnly; Max-Age=0; Path=/; SameSite=None; Secure');
				return new Response(JSON.stringify({ success: true }), { headers: responseHeaders });
			}

			// GET /me
			if (path === '/me' && method === 'GET') {
				const user = getUserFromSession(request);
				if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
				return new Response(JSON.stringify({ user }), { headers });
			}

			// GET /assignments
			if (path === '/assignments' && method === 'GET') {
				const user = getUserFromSession(request);
				if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
				const assignments = db.assignments.filter(a => a.user_id === user.id);
				return new Response(JSON.stringify({ assignments }), { headers });
			}

			// POST /assignments
			if (path === '/assignments' && method === 'POST') {
				const user = getUserFromSession(request);
				if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
				const data = await getBody();
				const assignment = {
					id: assignmentIdCounter++,
					user_id: user.id,
					title: data.title,
					due_date: data.due_date || null,
					pdf_file: data.pdf_file || null,
					status: 'pending',
					created_at: new Date()
				};
				db.assignments.push(assignment);
				return new Response(JSON.stringify({ assignment }), { status: 201, headers });
			}

			// PATCH /assignments/:id
			if (path.startsWith('/assignments/') && method === 'PATCH') {
				const user = getUserFromSession(request);
				if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
				const id = parseInt(path.split('/')[2]);
				const data = await getBody();
				const assignment = db.assignments.find(a => a.id === id && a.user_id === user.id);
				if (!assignment) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
				assignment.status = data.status;
				return new Response(JSON.stringify({ assignment }), { headers });
			}

			// DELETE /assignments/:id
			if (path.startsWith('/assignments/') && method === 'DELETE') {
				const user = getUserFromSession(request);
				if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
				const id = parseInt(path.split('/')[2]);
				const index = db.assignments.findIndex(a => a.id === id && a.user_id === user.id);
				if (index === -1) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
				db.assignments.splice(index, 1);
				return new Response(JSON.stringify({ success: true }), { headers });
			}

			// GET /todos
			if (path === '/todos' && method === 'GET') {
				const user = getUserFromSession(request);
				if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
				const todos = db.todos.filter(t => t.user_id === user.id);
				return new Response(JSON.stringify({ todos }), { headers });
			}

			// POST /todos
			if (path === '/todos' && method === 'POST') {
				const user = getUserFromSession(request);
				if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
				const data = await getBody();
				const todo = {
					id: todoIdCounter++,
					user_id: user.id,
					title: data.title,
					completed: 0,
					created_at: new Date()
				};
				db.todos.push(todo);
				return new Response(JSON.stringify({ todo }), { status: 201, headers });
			}

			// PATCH /todos/:id
			if (path.startsWith('/todos/') && method === 'PATCH') {
				const user = getUserFromSession(request);
				if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
				const id = parseInt(path.split('/')[2]);
				const data = await getBody();
				const todo = db.todos.find(t => t.id === id && t.user_id === user.id);
				if (!todo) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
				todo.completed = data.completed;
				return new Response(JSON.stringify({ todo }), { headers });
			}

			// DELETE /todos/:id
			if (path.startsWith('/todos/') && method === 'DELETE') {
				const user = getUserFromSession(request);
				if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
				const id = parseInt(path.split('/')[2]);
				const index = db.todos.findIndex(t => t.id === id && t.user_id === user.id);
				if (index === -1) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
				db.todos.splice(index, 1);
				return new Response(JSON.stringify({ success: true }), { headers });
			}

			// GET /mess-menu
			if (path.startsWith('/mess-menu') && method === 'GET') {
				const day = new URL(request.url).searchParams.get('day') || 'today';
				let targetDay = day;
				if (day === 'today') {
					const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
					targetDay = days[new Date().getDay()];
				}
				const menu = db.mess_menu.find(m => m.day === targetDay.toLowerCase());
				return new Response(JSON.stringify({ menu: menu || null }), { headers });
			}

			// PATCH /mess-menu/:day
			if (path.startsWith('/mess-menu/') && method === 'PATCH') {
				const day = path.split('/')[2];
				const data = await getBody();
				const menuItem = db.mess_menu.find(m => m.day === day.toLowerCase());
				if (!menuItem) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });

				Object.assign(menuItem, data);
				return new Response(JSON.stringify({ success: true, menu: menuItem }), { headers });
			}

			// GET /profile
			if (path === '/profile' && method === 'GET') {
				const user = getUserFromSession(request);
				if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
				const profile = { semester: user.semester || '', branch: user.branch || '', gender: user.gender || '', primary_goal: user.primary_goal || '' };
				return new Response(JSON.stringify({ profile }), { headers });
			}

			// PATCH /profile
			if (path === '/profile' && method === 'PATCH') {
				const user = getUserFromSession(request);
				if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });
				const data = await getBody();
				user.semester = data.semester;
				user.branch = data.branch;
				user.gender = data.gender;
				user.primary_goal = data.primary_goal;
				return new Response(JSON.stringify({ success: true, profile: data }), { headers });
			}

			// POST /chat
			if (path === '/chat' && method === 'POST') {
				const user = getUserFromSession(request);
				if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers });

				const data = await getBody();
				const { message } = data;
				if (!message) return new Response(JSON.stringify({ error: 'Message required' }), { status: 400, headers });

				// SIMULATED AI LOGIC (Rule-based for demo)
				let response: { message: string; action: string | null; data: any } = {
					message: "I couldn't understand that. Try 'Add assignment Math due Friday' or 'Add todo buy milk'.",
					action: null,
					data: null
				};

				const lowerMsg = message.toLowerCase();

				// 1. Add Assignment
				if (lowerMsg.includes('assignment') && lowerMsg.includes('add')) {
					const titleMatch = message.match(/assignment\s+(.*?)\s+(due|on)/i) || message.match(/add\s+(.*?)\s+assignment/i);
					const title = titleMatch ? titleMatch[1] : "New Assignment";

					const assignment = {
						id: assignmentIdCounter++,
						user_id: user.id,
						title: title,
						due_date: new Date().toISOString(),
						status: 'pending',
						created_at: new Date()
					};
					db.assignments.push(assignment);

					response = {
						message: `Got it! I've added "${title}" to your Assignments.`,
						action: "CREATE_ASSIGNMENT",
						data: assignment
					};
				}

				// 2. Add Todo
				else if (lowerMsg.includes('todo') && lowerMsg.includes('add')) {
					const title = message.replace(/add\s+todo\s+/i, '').replace(/todo\s+/i, '');
					const todo = {
						id: todoIdCounter++,
						user_id: user.id,
						title: title,
						completed: 0,
						created_at: new Date()
					};
					db.todos.push(todo);

					response = {
						message: `Added "${title}" to your Todo list.`,
						action: "CREATE_TODO",
						data: todo
					};
				}

				// 3. View Mess Menu
				else if (lowerMsg.includes('mess') || lowerMsg.includes('food') || lowerMsg.includes('menu')) {
					// Logic for day selection simplified for demo
					const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
					const today = days[new Date().getDay()];
					const menu = db.mess_menu.find(m => m.day === today);

					response = {
						message: `Here is today's menu (${today}): ${menu ? menu.lunch : 'No menu available'}.`,
						action: "VIEW_MESS_MENU",
						data: menu
					};
				}

				return new Response(JSON.stringify(response), { headers });
			}

			return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });

		} catch (err) {
			return new Response(JSON.stringify({ error: 'Internal Error' }), { status: 500, headers });
		}
	},
};
