import type { RequestHandler } from '@sveltejs/kit';
import { sse } from '$lib/server/services/sse.service';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
	const user = await getAuthenticatedUser(request);
	if (!user.admin) throw error(403, 'You are not allowed to run this action');

	const id = new Date().getTime();

	const stream = new ReadableStream({
		start(controller) {
			sse.addClient(id, controller);
		},
		cancel() {
			sse.removeClient(id);
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache'
		}
	});
};
