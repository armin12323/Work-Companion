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

import { stringify } from "node:querystring";


export default {
	async fetch(request, env, ctx): Promise<Response> {

		const corsHeaders = {
			'Access-Control-Allow-Origin': '*', // Replace '*' with your specific domain for better security
			'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS, PUT, DELETE',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		// 1. Handle CORS preflight requests THIS IS REQUIRED FOR PUT!!!!!
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: corsHeaders,
			});
		}

		const { pathname } = new URL(request.url);

		if (request.method == 'POST') {

			const data = await request.json()
			console.log('data: ', data)

			if (pathname === "/api/notes") {

				const clerk_id = data.clerk_id
				const user_id_query = await env.d1_worker.prepare("select id from users1 where clerk_id = ? ").bind(clerk_id).all()
				const user_id = user_id_query.results[0].id
				const notes = await env.d1_worker.prepare("select id, title, note, date_created, modified, due_date, user_id from notes1 where user_id = ?").bind(user_id).all()
				
				// return Response.json(notes);
				return new Response(JSON.stringify(notes), {
					status: 200,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": '*', // Authorizes your React app
					},
				});
			}
			else if (pathname === "/api/notes/add") {
				console.log('note add pathname')
				const clerk_id = data.clerk_id
				const user_id_query = await env.d1_worker.prepare("select id from users1 where clerk_id = ? ").bind(clerk_id).all()
				const user_id = user_id_query.results[0].id
				const add_note_query = await env.d1_worker.prepare("insert into notes1 (title, note, date_created, modified, due_date, user_id) values (?, ?, ?, ?, ?, ?)").bind(data.title, data.note, data.date_created, data.modified, data.due_date, user_id).run()
				console.log('add not query id: ', add_note_query.meta.last_row_id)
				const note_id = add_note_query.meta.last_row_id
				
				return new Response(JSON.stringify({userID: user_id, noteID: note_id}), {
					status: 200,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": '*', // Authorizes your React app
					}
				});


			}
		}

		if (request.method == 'PUT') {

			if (pathname === "/api/notes/update") {
				const data = await request.json()

				console.log('request:: ', request)
				console.log('data: ', data)

				const clerk_id = data.clerk_id
				const user_id_query = await env.d1_worker.prepare("select id from users1 where clerk_id = ? ").bind(clerk_id).all()
				const user_id = user_id_query.results[0].id

				const update_note = await env.d1_worker.prepare("update notes1 set title = ?, note = ?, date_created = ?, modified = ?, due_date = ? where user_id = ? and date_created = ?").bind(data.title, data.note, data.date_created, data.modified, data.due_date, user_id, data.date_created).run()

				return new Response('Note Updated', {
					status: 200,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": '*', // Authorizes your React app
					}
				});

			}
		}

		if (request.method == 'DELETE') { 
			if (pathname === "/api/notes/delete") { 
				const data = await request.json()

				console.log('request:: ', request)
				console.log('data: ', data)

				const clerk_id = data.clerk_id
				const user_id_query = await env.d1_worker.prepare("select id from users1 where clerk_id = ? ").bind(clerk_id).all()
				const user_id = user_id_query.results[0].id

				const update_note = await env.d1_worker.prepare("delete from notes1 where user_id = ?").bind(user_id).run()


			}
		}

		return new Response("Wrong Endpoint FOOL HAHAHAHA");
	},
} satisfies ExportedHandler<Env>;
