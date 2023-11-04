import type { RequestHandler } from '@sveltejs/kit';
import { sse } from '$lib/server/services/sse.service';

export const GET: RequestHandler = () => {
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
